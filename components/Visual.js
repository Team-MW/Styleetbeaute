"use client";

import { useId } from "react";
import { drawPlate } from "@/lib/plates";

export function Visual({ product }) {
  const rawId = useId();
  if (product.image) {
    return (
      <div className="visual">
        <img src={product.image} alt="" onError={(event) => event.currentTarget.classList.add("is-broken")} />
      </div>
    );
  }
  return <div className="visual" dangerouslySetInnerHTML={{ __html: drawPlate(product, rawId) }} />;
}
