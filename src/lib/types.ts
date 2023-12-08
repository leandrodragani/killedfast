import { Prisma } from "@prisma/client";

const productType = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    category: true,
    tags: {
      include: {
        tag: true,
      },
    },
    author: true,
    comments: true,
  },
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productType>;

const commentWithAuthor = Prisma.validator<Prisma.CommentArgs>()({
  include: {
    author: true,
  },
});

export type CommentWithAuthor = Prisma.CommentGetPayload<
  typeof commentWithAuthor
>;
