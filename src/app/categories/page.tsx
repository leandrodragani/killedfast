import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import kebabCase from "lodash/kebabCase";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KilledFast | Showcase your failed products",
  description: "The place we learn from every failure",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container">
        <section className="flex max-w-[980px] flex-col items-start gap-2 pt-8 md:pt-12 page-header pb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] hidden md:block">
            Categories
          </h1>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] md:hidden">
            Categories
          </h1>
          <span className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Browse through the categories to find the product you are looking
          </span>
        </section>
        <section className="grid grid-cols-3 gap-8 mt-12">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="hover:border-primary/40 transition-all"
            >
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{category.products.length} products</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/categories/${category.slug}`}>View all</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
