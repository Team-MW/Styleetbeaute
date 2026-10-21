"use client";

import { Fragment, useState } from "react";
import { categoryById, money, PRODUCTS } from "@/lib/catalog";
import { useCart } from "@/components/CartProvider";
import { Crumbs } from "@/components/Crumbs";
import { ProductCard } from "@/components/ProductCard";
import { Visual } from "@/components/Visual";

export function ProductDetail({ product }) {
  const { add } = useCart();
  const category = categoryById(product.category);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState("");
  const [shake, setShake] = useState(false);
  const related = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  function onAdd() {
    if (product.sizes && !size) {
      setSizeError("Choisissez une taille.");
      setShake(false);
      requestAnimationFrame(() => setShake(true));
      return;
    }
    add(product.id, product.sizes ? size : null, qty);
  }

  return (
    <section className="section">
      <div className="wrap">
        <Crumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Boutique", href: "/boutique" },
            { label: category.label, href: "/boutique/" + category.id },
            { label: product.name },
          ]}
        />
        <div className="product-layout">
          <div className="product-gallery">
            {product.badge ? <span className="badge">{product.badge}</span> : null}
            <Visual product={product} />
          </div>
          <div className="product-info">
            <p className="kicker">{category.label}</p>
            <h2>{product.name}</h2>
            <p className="product-price">{money(product.price)}</p>
            <p className="lead">{product.description}</p>
            {product.sizes ? (
              <div className="sizes">
                <div className="sizes-label">
                  <span>Taille</span>
                  <span className="size-error">{sizeError}</span>
                </div>
                <div className={"size-list" + (shake ? " shake" : "")} onAnimationEnd={() => setShake(false)}>
                  {product.sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={"size-btn" + (size === item ? " is-on" : "")}
                      aria-pressed={size === item}
                      onClick={() => {
                        setSize(item);
                        setSizeError("");
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="buy-row">
              <div className="qty">
                <button type="button" aria-label="Diminuer la quantité" onClick={() => setQty((value) => Math.max(1, value - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" aria-label="Augmenter la quantité" onClick={() => setQty((value) => Math.min(8, value + 1))}>
                  +
                </button>
              </div>
              <button type="button" className="btn btn-gold" onClick={onAdd}>
                Ajouter au panier
              </button>
            </div>
            <p className="note">Disponible. Expédition après confirmation de la maison.</p>
            <dl className="facts">
              {product.facts.map(([label, value]) => (
                <Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>
        <header className="section-head related-head">
          <p className="kicker">Dans le même univers</p>
          <h2>À porter avec</h2>
        </header>
        <div className="product-grid is-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
