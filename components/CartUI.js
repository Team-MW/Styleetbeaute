"use client";

import Link from "next/link";
import { CONFIG, lineKey, money } from "@/lib/catalog";
import { useCart } from "@/components/CartProvider";
import { Visual } from "@/components/Visual";

export function ShippingNote({ totals }) {
  if (totals.sub <= 0) return null;
  if (totals.shipping === 0) {
    return (
      <>
        <p className="ship-ok">Livraison offerte</p>
        <div className="bar" aria-hidden="true">
          <span style={{ width: "100%" }} />
        </div>
      </>
    );
  }
  const ratio = Math.min(100, Math.round((totals.sub / CONFIG.freeShipping) * 100));
  const missing = CONFIG.freeShipping - totals.sub;
  return (
    <>
      <p className="ship-ok">Plus que {money(missing)} pour la livraison offerte.</p>
      <div className="bar" aria-hidden="true">
        <span style={{ width: ratio + "%" }} />
      </div>
    </>
  );
}

export function Totals({ totals }) {
  return (
    <>
      <div className="total-row">
        <span>Sous-total</span>
        <span>{money(totals.sub)}</span>
      </div>
      <div className="total-row">
        <span>Livraison</span>
        <span>{totals.shipping === 0 ? "Offerte" : money(totals.shipping)}</span>
      </div>
      <div className="total-row grand">
        <span>Total</span>
        <span>{money(totals.total)}</span>
      </div>
    </>
  );
}

export function CartLine({ line, onNavigate }) {
  const { changeQty, remove } = useCart();
  const key = lineKey(line);
  return (
    <article className="cart-line">
      <Link href={"/produit/" + line.product.id} onClick={onNavigate}>
        <Visual product={line.product} />
      </Link>
      <div className="cart-line-body">
        <div className="card-row">
          <strong>
            <Link href={"/produit/" + line.product.id} onClick={onNavigate}>
              {line.product.name}
            </Link>
          </strong>
          <span>{money(line.lineTotal)}</span>
        </div>
        <p className="card-meta">
          {line.product.subtitle}
          {line.size ? " · Taille " + line.size : ""}
        </p>
        <div className="card-row">
          <div className="qty">
            <button type="button" aria-label="Diminuer" onClick={() => changeQty(key, -1)}>
              −
            </button>
            <span>{line.qty}</span>
            <button type="button" aria-label="Augmenter" onClick={() => changeQty(key, 1)}>
              +
            </button>
          </div>
          <button type="button" className="text-btn" onClick={() => remove(key)}>
            Retirer
          </button>
        </div>
      </div>
    </article>
  );
}
