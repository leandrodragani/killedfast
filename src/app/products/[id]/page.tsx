import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { mapStatusToLabel } from "@/lib/utils";
import { ArrowLeftIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Link2Icon,
  SkullIcon,
  SproutIcon,
  StethoscopeIcon,
  UsersIcon,
} from "lucide-react";

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Fragment } from "react";
import Image from "next/image";
import { CommentForm } from "./comment-form";
import { CommentWithAuthor } from "@/lib/types";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "KilledFast | Showcase your failed products",
  description: "The place we learn from every failure",
};

function DetailItem({
  Icon,
  children,
}: {
  Icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Icon
        className="h-6 w-6 text-muted-foreground"
        aria-hidden="true"
        strokeWidth="1px"
      />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

const Comment: React.FC<{ comment: CommentWithAuthor }> = ({ comment }) => (
  <div className="p-6 text-base">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <p className="inline-flex items-center mr-3 text-sm text-foreground font-semibold">
          <Image
            className="mr-2 w-6 h-6 rounded-full"
            src={`https://ui-avatars.com/api/?name=${comment.author.name}&background=random&size=128`}
            alt={comment.author.name || "Author"}
            width={24}
            height={24}
          />
          {comment.author.name}
        </p>
        <p className="text-sm text-muted-foreground/50">
          {format(new Date(comment.author.createdAt), "MMM dd, yyyy")}
        </p>
      </div>
      {/* <DropdownMenu commentId={comment.id} /> */}
    </div>
    <p className="text-muted-foreground">{comment.text}</p>
    {/* {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4 ml-6 lg:ml-12">
        {comment.replies.map((reply) => (
          <Comment key={reply.id} comment={reply} />
        ))}
      </div>
    )} */}
  </div>
);

export default async function ProductsPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  const product = await prisma.product.findFirst({
    where: {
      slug: params.id,
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      resourceUrls: true,
    },
  });

  if (!product?.id) {
    notFound();
  }

  const detailItems = [
    {
      Icon: StethoscopeIcon,
      children: `${mapStatusToLabel(product.status)}`,
    },
    {
      Icon: SproutIcon,
      children: `Date of birth ${format(
        new Date(product.dateOfCreation),
        "MMM dd, yyyy"
      )}`,
    },
    {
      Icon: SkullIcon,
      children: product.dateOfDeath
        ? `Date of dead ${format(
            new Date(product.dateOfDeath),
            "MMM dd, yyyy"
          )}`
        : null,
      hidden: !product.dateOfDeath,
    },
    {
      Icon: ChatBubbleIcon,
      children: `${product.comments.length} comments`,
      hidden: !product.comments.length,
    },
    {
      Icon: UsersIcon,
      children: `Number of users ${product.numberOfUsers}`,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <div className="py-8 lg:py-10 container">
        <Link href="/" replace>
          <div className="flex items-centertext-lg transition-colors text-primary">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            All Products
          </div>
        </Link>
        <div className="lg:grid lg:grid-cols-3 mt-4">
          <div className="lg:col-span-2 lg:border-r lg:pr-8">
            <div>
              <div>
                <div className="md:flex md:items-center md:justify-between md:space-x-4 lg:border-b lg:pb-6">
                  <div>
                    <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
                      {product.name}
                    </h1>
                    <h2 className="text-muted-foreground text-2xl max-w-xl">
                      {product.slogan}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Published by{" "}
                      <Link
                        href="#"
                        className="font-medium text-primary-foreground"
                      >
                        {product.author.name}
                      </Link>{" "}
                      in{" "}
                      <Link
                        href={`/categories/${product.category.slug}`}
                        className="font-medium text-primary-foreground"
                      >
                        {product.category.name}
                      </Link>{" "}
                      on {format(new Date(product.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3 md:mt-0">
                    {product.website ? (
                      <Button asChild>
                        <a href={product.website} target="_blank">
                          <Link2Icon
                            className="-ml-0.5 mr-2 h-5 w-5 text-muted-foreground"
                            aria-hidden="true"
                          />
                          Visit website
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <aside className="mt-8 lg:hidden">
                  <h2 className="sr-only">Details</h2>
                  <div className="space-y-5">
                    {detailItems.map(({ Icon, children, hidden }) => {
                      if (hidden) return null;

                      return (
                        <DetailItem key={children} Icon={Icon}>
                          {children}
                        </DetailItem>
                      );
                    })}
                  </div>
                  <div className="mt-6 space-y-8 border-b border-t py-6">
                    <div>
                      <h2 className="text-sm font-medium text-foreground">
                        Author
                      </h2>
                      <ul role="list" className="mt-3 space-y-3">
                        <li className="flex justify-start">
                          <Link
                            href="#"
                            className="flex items-center space-x-3"
                          >
                            <div className="flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={`https://ui-avatars.com/api/?name=${product.author.name}&background=random&size=128`}
                                alt={product.author.name || "Author"}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                              {product.author.name}
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-foreground">
                        Tags
                      </h2>
                      <ul role="list" className="mt-2 leading-8 space-x-2">
                        {product.tags?.map((tag) => (
                          <Link
                            key={tag.tagId}
                            className={badgeVariants({
                              variant: "outline",
                              className: "inline",
                            })}
                            href={`/tags/${tag.tag.slug}}`}
                          >
                            {tag.tag.name}
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
                <div className="py-3 lg:pb-0 lg:pt-6">
                  <h2 className="sr-only">Description</h2>
                  <div className="prose max-w-none prose-red prose-invert text-muted-foreground">
                    <h3>What does your product do or did?</h3>
                    <p>{product.description}</p>
                    <h3>What do you think went wrong with it?</h3>
                    <p>{product.reasonForFailure}</p>
                    <h3>What were the key challenges you faced?</h3>
                    <p>{product.keyChallenges}</p>
                    <h3>What were the major lessons you learned?</h3>
                    <p>{product.lessonsLearned}</p>
                    <h3>What would you have done differently?</h3>
                    <p>{product.whatWouldYouDoDifferently}</p>
                    <h3>
                      What advice would you give for upcoming entrepeneurs? Who
                      may want to build a similar product?
                    </h3>
                    <p>{product.tipsOrAdvice}</p>
                    <h3>What resources did you find useful?</h3>
                    <ul role="list">
                      {product.resourceUrls.map((url) => (
                        <li key={url.id}>
                          <a href={url.url}>{url.url}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <section
              aria-labelledby="activity-title"
              className="mt-8 lg:mt-10 border-t"
            >
              <div className="pb-4">
                <h2
                  id="activity-title"
                  className="text-2xl md:text-3xl font-bold text-primary-foreground tracking-tighter mt-10"
                >
                  Comments ({product.comments.length})
                </h2>
              </div>
              <div className="pt-6">
                {!userId ? (
                  <div className="text-center border p-8 rounded-lg">
                    <p className="text-center">
                      You must be logged in to comment.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      size="sm"
                      asChild
                    >
                      <Link href={`/login`}>Login</Link>
                    </Button>
                  </div>
                ) : (
                  <CommentForm productId={product.id} />
                )}
                <div className="divide-y space-y-6 mt-10">
                  {product.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            </section>
          </div>
          <aside className="hidden lg:block lg:pl-8">
            <h2 className="sr-only">Details</h2>
            <div className="space-y-5">
              {detailItems.map(({ Icon, children, hidden }) => {
                if (hidden) return null;

                return (
                  <DetailItem key={children} Icon={Icon}>
                    {children}
                  </DetailItem>
                );
              })}
            </div>
            <div className="mt-6 space-y-8 border-t py-6">
              <div>
                <h2 className="text-sm font-medium text-foreground">Author</h2>
                <ul role="list" className="mt-3 space-y-3">
                  <li className="flex justify-start">
                    <Link href="#" className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${product.author.name}&background=random&size=128`}
                          alt={product.author.name || "Author"}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {product.author.name}
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-medium text-foreground">Tags</h2>
                <ul role="list" className="mt-2 leading-8 space-x-2">
                  {product.tags?.map((tag) => (
                    <Link
                      key={tag.tagId}
                      className={badgeVariants({
                        variant: "outline",
                        className: "inline",
                      })}
                      href={`/tags/${tag.tag.slug}}`}
                    >
                      {tag.tag.name}
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
