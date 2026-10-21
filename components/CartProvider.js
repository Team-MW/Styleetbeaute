"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CONFIG, getProduct, lineKey } from "@/lib/catalog";

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem("sb-cart") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((line) => line && getProduct(line.id) && line.qty > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setCart(loadCart());
    try {
      const saved = JSON.parse(sessionStorage.getItem("sb-order") || "null");
      if (saved && saved.number) setOrder(saved);
    } catch {
      setOrder(null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function persist(next) {
    setCart(next);
    localStorage.setItem("sb-cart", JSON.stringify(next));
  }

  function persistOrder(next) {
    setOrder(next);
    if (next) sessionStorage.setItem("sb-order", JSON.stringify(next));
    else sessionStorage.removeItem("sb-order");
  }

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = getProduct(line.id);
          if (!product) return null;
          return { ...line, product, lineTotal: product.price * line.qty };
        })
        .filter(Boolean),
    [cart]
  );

  const totals = useMemo(() => {
    const sub = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const shipping = sub === 0 || sub >= CONFIG.freeShipping ? 0 : CONFIG.shippingFee;
    return {
      sub,
      shipping,
      total: sub + shipping,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
    };
  }, [lines]);

  function add(id, size, qty) {
    persistOrder(null);
    const chosen = size || null;
    const next = cart.map((line) => ({ ...line }));
    const found = next.find((line) => line.id === id && (line.size || null) === chosen);
    if (found) found.qty = Math.min(8, found.qty + qty);
    else next.push({ id, size: chosen, qty });
    persist(next);
    const product = getProduct(id);
    setToast("Ajouté au panier · " + product.name + (chosen ? " · " + chosen : ""));
  }

  function changeQty(key, dir) {
    const next = cart
      .map((line) => {
        if (lineKey(line) !== key) return line;
        return { ...line, qty: Math.min(8, Math.max(1, line.qty + dir)) };
      });
    persist(next);
  }

  function remove(key) {
    persist(cart.filter((line) => lineKey(line) !== key));
  }

  function placeOrder(customer) {
    const current = lines;
    const snapshot = totals;
    const next = {
      number: "SN-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      customer,
      lines: current.map((line) => ({
        name: line.product.name,
        size: line.size,
        qty: line.qty,
        price: line.product.price,
      })),
      totals: snapshot,
    };
    persist([]);
    persistOrder(next);
    return next;
  }

  const value = {
    ready,
    lines,
    totals,
    open,
    setOpen,
    toast,
    setToast,
    order,
    add,
    changeQty,
    remove,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("Le panier n'est pas disponible.");
  return value;
}
