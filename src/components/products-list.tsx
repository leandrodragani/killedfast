import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { badgeVariants } from "./ui/badge";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { ProductWithRelations } from "@/lib/types";
import { kebabCase } from "lodash";
import { Button } from "./ui/button";

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

export function ProductsList({
  products,
}: {
  products: ProductWithRelations[];
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-t">
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          No products here yet...
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first one to share your product on this category.
        </p>
        <div className="mt-6">
          <Button>
            <Link href="/submit-product">Submit your product</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6 sm:flex-nowrap hover:bg-gradient-to-l from-foreground/5 to-transparent px-4 -mx-4"
        >
          <div className="flex">
            <Image
              className="h-12 w-12 flex-none rounded-lg bg-gray-50"
              src={`https://ui-avatars.com/api/?name=${product.name}&background=random&size=128`}
              width={48}
              height={48}
              alt={product.name}
            />
            <div className="ml-6">
              <p className="font-medium leading-6">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-foreground/75 transition-all"
                >
                  {product.name} — {product.slogan}
                </Link>
              </p>
              <div className="mt-2 flex items-center gap-x-2 leading-5 text-muted-foreground text-sm">
                <p>
                  <Link href={product?.author.id} className="hover:underline">
                    {product.author?.name}
                  </Link>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="flex space-x-2">
                  {product.tags?.map((tag) => (
                    <Link
                      key={tag.tagId}
                      className={badgeVariants({
                        variant: "outline",
                        className: "inline",
                      })}
                      href={`/tags/${kebabCase(tag.tag.name)}`}
                    >
                      {tag.tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
            <div className="flex gap-x-2.5 items-center">
              {product.comments.length > 0 ? (
                <>
                  <dt>
                    <span className="sr-only">Total comments</span>
                    <ChatBubbleIcon
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6">
                    {product.comments.length}
                  </dd>
                </>
              ) : null}
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
