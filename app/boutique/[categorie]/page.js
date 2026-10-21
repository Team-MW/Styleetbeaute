import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES, categoryById } from "@/lib/catalog";
import { Shop } from "@/components/Shop";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categorie: category.id }));
}

export async function generateMetadata({ params }) {
  const { categorie } = await params;
  const category = categoryById(categorie);
  return { title: category ? category.label : "Boutique" };
}

export default async function CategoryPage({ params }) {
  const { categorie } = await params;
  if (!categoryById(categorie)) notFound();
  return (
    <Suspense fallback={null}>
      <Shop category={categorie} />
    </Suspense>
  );
}
