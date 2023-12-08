import { SubmitProductForm } from "@/components/submit-product-form";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KilledFast | Showcase your failed products",
  description: "The place we learn from every failure",
};

export default async function SubmitProductPage() {
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container">
        <section className="flex max-w-[980px] flex-col items-start gap-2 pt-8 md:pt-12 page-header pb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] hidden md:block">
            Submit your product
          </h1>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] md:hidden">
            Submit your product
          </h1>
          <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Showcase your failed product and share your experience with others
            to learn from your mistakes.
          </span>
        </section>
        <section className="mt-12">
          <SubmitProductForm categories={categories} tags={tags} />
        </section>
      </div>
    </main>
  );
}
