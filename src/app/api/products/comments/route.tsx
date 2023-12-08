import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { CommentFormValues } from "@/app/products/[id]/comment-form";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: CommentFormValues & { productId: number } =
      await request.json();

    const newComment = await prisma.comment.create({
      data: {
        text: body.commentText,
        productId: body.productId,
        authorId: userId,
      },
    });

    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
