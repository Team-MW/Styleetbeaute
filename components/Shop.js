"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, categoryById, pieces, PRODUCTS } from "@/lib/catalog";
import { Crumbs } from "@/components/Crumbs";
import { Icon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";

export function Shop({ category }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = params.get("q") || "";
  const sort = params.get("tri") || "featured";
  const current = categoryById(category);
  const title = current ? current.label : "La boutique";
  const text = current
    ? current.text
    : "Parfums, vêtements, chaussures et accessoires. Une sélection courte, pour une allure nette.";

  useEffect(() => {
    if (params.get("focus") !== "1") return;
    document.getElementById("search")?.focus();
    const next = new URLSearchParams(params);
    next.delete("focus");
    const qs = next.toString();
    router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
  }, [params, pathname, router]);

  const needle = query.trim().toLowerCase();
  const list = PRODUCTS.filter((product) => {
    if (category !== "tous" && product.category !== category) return false;
    if (!needle) return true;
    const blob = [product.name, product.subtitle, product.description, categoryById(product.category).label]
      .join(" ")
      .toLowerCase();
    return blob.includes(needle);
  });
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));

  function update(key, value) {
    const next = new URLSearchParams(params);
    next.delete("focus");
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
  }

  function hrefFor(id) {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (sort !== "featured") next.set("tri", sort);
    const qs = next.toString();
    const path = id === "tous" ? "/boutique" : "/boutique/" + id;
    return path + (qs ? "?" + qs : "");
  }

  const crumbs = [
    { label: "Accueil", href: "/" },
    { label: "Boutique", href: "/boutique" },
  ];
  if (current) crumbs.push({ label: current.label });

  return (
    <section className="section shop">
      <div className="wrap">
        <Crumbs items={crumbs} />
        <header className="section-head">
          <p className="kicker">Boutique</p>
          <h2>{title}</h2>
          <p className="hero-lead">{text}</p>
        </header>
        <div className="toolbar">
          <label className="search">
            <Icon name="search" />
            <input
              id="search"
              type="search"
              placeholder="Rechercher une pièce"
              value={query}
              autoComplete="off"
              onChange={(event) => update("q", event.target.value)}
            />
          </label>
          <select
            id="sort"
            className="sort-select"
            aria-label="Trier"
            value={sort}
            onChange={(event) => update("tri", event.target.value === "featured" ? "" : event.target.value)}
          >
            <option value="featured">Mise en avant</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom</option>
          </select>
        </div>
        <div className="chips">
          <Link className={"chip" + (category === "tous" ? " is-on" : "")} href={hrefFor("tous")}>
            Tous
          </Link>
          {CATEGORIES.map((item) => (
            <Link key={item.id} className={"chip" + (category === item.id ? " is-on" : "")} href={hrefFor(item.id)}>
              {item.label}
            </Link>
          ))}
        </div>
        <p className="results-meta">{list.length ? pieces(list.length) : "Aucun résultat"}</p>
        <div className="product-grid">
          {list.length ? (
            list.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="empty-shop">
              <p>Aucune pièce ne correspond.</p>
              <Link href="/boutique">Voir toute la boutique</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
