"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CATEGORIES, CONFIG } from "@/lib/catalog";
import { useCart } from "@/components/CartProvider";
import { CartLine, ShippingNote, Totals } from "@/components/CartUI";
import { Icon } from "@/components/Icons";

export function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, lines, totals, open, setOpen, toast, setToast } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pop, setPop] = useState(false);
  const seen = useRef(false);

  const shopOn = pathname.startsWith("/boutique") || pathname.startsWith("/produit") || pathname.startsWith("/commande");
  const nav = [
    { href: "/", label: "Accueil", on: pathname === "/" },
    { href: "/boutique", label: "Boutique", on: shopOn },
    { href: "/maison", label: "La maison", on: pathname.startsWith("/maison") },
    { href: "/contact", label: "Contact", on: pathname.startsWith("/contact") },
  ];

  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    document.body.classList.toggle("locked", menuOpen || open);
  }, [menuOpen, open]);

  useEffect(() => {
    function onKey(event) {
      if (event.key !== "Escape") return;
      if (open) setOpen(false);
      else if (menuOpen) setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menuOpen, setOpen]);

  useEffect(() => {
    if (!ready) return;
    if (!seen.current) {
      seen.current = true;
      return;
    }
    setPop(true);
  }, [ready, totals.count]);

  function onSearch(event) {
    event.preventDefault();
    if (pathname === "/boutique" || pathname.startsWith("/boutique/")) {
      document.getElementById("search")?.focus();
      return;
    }
    router.push("/boutique?focus=1");
  }

  const year = new Date().getFullYear();
  const phoneHref = "tel:" + CONFIG.phone.replaceAll(" ", "");

  return (
    <>
      <a className="skip" href="#app">
        Aller au contenu
      </a>
      <div className="topbar">
        <div className="announcement">
          <p>
            Livraison offerte dès 150{"\u00A0"}€ <span className="dot">·</span> Échanges sous 14 jours{" "}
            <span className="extra">
              <span className="dot">·</span> Chaque commande est confirmée
            </span>
          </p>
        </div>
        <header className="header">
          <div className="header-inner">
            <Link className="brand" href="/">
              <img className="brand-mark" src="/logo.jpg" alt="" />
              <span className="brand-text">
                <small>Maison SN</small>
                <strong>Style & Beauté</strong>
              </span>
            </Link>
            <nav className={"nav" + (menuOpen ? " is-open" : "")} id="nav" aria-label="Navigation">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className={item.on ? "is-active" : undefined} aria-current={item.on ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <a className="icon-btn" href="/boutique" aria-label="Rechercher" onClick={onSearch}>
                <Icon name="search" />
              </a>
              <button
                type="button"
                className="icon-btn cart-btn"
                aria-label="Ouvrir le panier"
                onClick={() => {
                  setToast("");
                  setOpen(true);
                }}
              >
                <Icon name="bag" />
                <span className={"cart-count" + (totals.count === 0 ? " is-empty" : "") + (pop ? " pop" : "")} onAnimationEnd={() => setPop(false)}>
                  {totals.count}
                </span>
              </button>
              <button
                type="button"
                className="nav-toggle"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((value) => !value)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </header>
      </div>

      <main id="app" tabIndex={-1}>
        <div className="view" key={pathname}>
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <img className="footer-mark" src="/logo.jpg" alt="" />
            <p>Parfums, vêtements, chaussures et accessoires. Une sélection courte, pour une allure qui dure.</p>
          </div>
          <div>
            <h3>Boutique</h3>
            {CATEGORIES.map((category) => (
              <Link key={category.id} href={"/boutique/" + category.id}>
                {category.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>La maison</h3>
            <Link href="/maison">Notre regard</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/mentions">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </div>
          <div>
            <h3>Écrire</h3>
            <a href={"mailto:" + CONFIG.email}>{CONFIG.email}</a>
            <a href={phoneHref}>{CONFIG.phone}</a>
            <span>{CONFIG.hours}</span>
            <span>{CONFIG.instagram}</span>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {year} Style & Beauté</span>
          <span>Maison SN</span>
        </div>
      </footer>

      <div className={"overlay" + (open ? " is-open" : "")} onClick={() => setOpen(false)} />
      <aside className={"drawer" + (open ? " is-open" : "")} aria-labelledby="drawer-title" aria-hidden={!open}>
        <div className="drawer-head">
          <h2 id="drawer-title">Panier</h2>
          <button type="button" className="icon-btn" aria-label="Fermer le panier" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">
          {lines.length ? (
            lines.map((line) => <CartLine key={line.id + (line.size || "")} line={line} onNavigate={() => setOpen(false)} />)
          ) : (
            <div className="cart-empty">
              <div className="crown">
                <Icon name="bag" />
              </div>
              <p>Votre panier est vide.</p>
              <Link className="btn btn-ghost" href="/boutique" onClick={() => setOpen(false)}>
                Découvrir la boutique
              </Link>
            </div>
          )}
        </div>
        {lines.length ? (
          <div className="drawer-foot">
            <ShippingNote totals={totals} />
            <Totals totals={totals} />
            <Link className="btn btn-gold btn-full" href="/commande" onClick={() => setOpen(false)}>
              Commander
            </Link>
            <button type="button" className="btn btn-ghost btn-full" onClick={() => setOpen(false)}>
              Continuer
            </button>
          </div>
        ) : (
          <div className="drawer-foot" />
        )}
      </aside>
      <div className={"toast" + (toast ? " is-on" : "")} role="status" aria-live="polite">
        <span>{toast}</span>
        <button
          type="button"
          onClick={() => {
            setToast("");
            setOpen(true);
          }}
        >
          Voir
        </button>
      </div>
    </>
  );
}
