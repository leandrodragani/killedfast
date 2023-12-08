import { ProductsList } from "@/components/products-list";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "KilledFast | Showcase your failed products",
  description:
    "A community to learn from every failure or perhaps revive your product. Everybody fails. You are not alone.",
};

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findFirst({
    where: {
      slug: params.id,
    },
  });

  if (!category?.id) {
    notFound();
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      comments: true,
      author: true,
    },
    where: {
      category: {
        slug: params.id,
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container">
        <section className="flex max-w-[980px] flex-col items-start gap-2 pt-8 md:pt-12 page-header pb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] hidden md:block">
            {category.name}
          </h1>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] md:hidden">
            {category.name}
          </h1>
          <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            {category.description}
          </span>
        </section>
        <ProductsList products={products ?? []} />
      </div>
    </main>
  );
}
