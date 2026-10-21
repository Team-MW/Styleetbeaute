"use client";

import Link from "next/link";
import { categoryById, money } from "@/lib/catalog";
import { useCart } from "@/components/CartProvider";
import { Visual } from "@/components/Visual";

export function ProductCard({ product }) {
  const { add } = useCart();
  const category = categoryById(product.category);
  const href = "/produit/" + product.id;

  return (
    <article className="card">
      <Link className="card-media" href={href} aria-label={product.name}>
        {product.badge ? <span className="card-badge">{product.badge}</span> : null}
        <Visual product={product} />
      </Link>
      <div className="card-body">
        <p className="card-kicker">{category.label}</p>
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className="card-meta">{product.subtitle}</p>
        <div className="card-row">
          <span className="price">{money(product.price)}</span>
          {product.sizes ? (
            <Link className="card-add" href={href}>
              Choisir
            </Link>
          ) : (
            <button type="button" className="card-add" onClick={() => add(product.id, null, 1)}>
              Ajouter
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
