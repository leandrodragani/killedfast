import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { SubmitProductFormValues } from "@/components/submit-product-form";
import { kebabCase } from "lodash";
import { ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      xAccount,
      rangeOfExistence,
      dateOfCreation,
      resourcesUrls,
      tags,
      ...body
    }: SubmitProductFormValues = await request.json();

    const productStatus = body.status as ProductStatus;

    const slug = kebabCase(body.name);

    const existingsProducts = await prisma.product.findMany({
      where: {
        slug: {
          search: slug,
        },
      },
    });

    const product = await prisma.product.create({
      data: {
        ...body,
        slug:
          existingsProducts.length > 0
            ? `${slug}-${existingsProducts.length + 1}`
            : slug,
        status: productStatus,
        author: {
          connect: {
            id: userId,
          },
        },
        category: {
          connect: {
            id: Number(body.category),
          },
        },
        dateOfCreation:
          productStatus !== ProductStatus.DEAD
            ? dateOfCreation
            : rangeOfExistence.from,
        dateOfDeath: rangeOfExistence.to,
        resourceUrls: {
          create: resourcesUrls?.map((url) => ({
            url: url.value,
          })),
        },
        tags: {
          create: tags?.map((tag) => ({
            tag: { connect: { id: Number(tag.value) } },
          })),
        },
      },
    });

    revalidatePath("/");

    return new NextResponse(JSON.stringify(product), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
