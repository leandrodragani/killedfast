import { ProductsList } from "@/components/products-list";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://killedfast.com"),
  title: "KilledFast | Showcase your failed products",
  description:
    "A community to learn from every failure or perhaps revive your product. Everybody fails. You are not alone.",
  openGraph: {
    title: "KilledFast | Showcase your failed products",
    description:
      "A community to learn from every failure or perhaps revive your product. Everybody fails. You are not alone.",
    images: [
      {
        url: "/opengraph-main.png",
        width: 1200,
        height: 630,
        alt: "KilledFast | Showcase your failed products",
      },
    ],
  },
  twitter: {
    title: "KilledFast | Showcase your failed products",
    description:
      "A community to learn from every failure or perhaps revive your product. Everybody fails. You are not alone.",
    images: [
      {
        url: "/opengraph-main.png",
        width: 1200,
        height: 630,
        alt: "KilledFast | Showcase your failed products",
      },
    ],
  },
};

export default async function HomePage() {
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
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <main className="flex flex-col container flex-grow relative">
      <div className="flex lg:flex-row flex-col-reverse justify-between items-center">
        <section className="flex max-w-[980px] flex-col items-start gap-2 pt-8 md:pt-16 page-header pb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] hidden md:block">
            Showcase your failed products
          </h1>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] md:hidden">
            Showcase your failed products
          </h1>
          <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            A community to learn from every failure or perhaps revive your
            product. Everybody fails. You are not alone.
          </span>
          <section className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
            <Button asChild size="sm">
              <Link href="/submit-product">Submit your product</Link>
            </Button>
          </section>
        </section>
        <div className="relative mt-10 lg:mt-0 h-[200px] aspect-[862/606]">
          <Image
            src="/hero.png"
            fill
            alt="hero-image"
            className="object-cover"
          />
        </div>
      </div>
      <ProductsList products={products ?? []} />
    </main>
  );
}
