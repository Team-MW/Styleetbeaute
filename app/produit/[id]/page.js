import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/catalog";
import { ProductDetail } from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? product.name : "Pièce" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
