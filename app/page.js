import Link from "next/link";
import { CATEGORIES, CONFIG, money, PRODUCTS } from "@/lib/catalog";
import { Icon, Ornament } from "@/components/Icons";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  const featured = PRODUCTS.filter((product) => product.featured);

  return (
    <>
      <section className="hero">
        <img className="hero-logo" src="/logo.jpg" alt="Style & Beauté — parfums, vêtements, chaussures, accessoires" />
        <p className="hero-tag">L'élégance, au quotidien.</p>
        <p className="hero-lead">
          Parfums, vêtements, chaussures et accessoires réunis dans une même maison. Peu de pièces, choisies pour leur ligne.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-gold" href="/boutique">
            Découvrir la boutique
          </Link>
          <Link className="btn btn-ghost" href="/maison">
            La maison
          </Link>
        </div>
        <ul className="hero-notes">
          <li>Livraison offerte dès {money(CONFIG.freeShipping)}</li>
          <li>Échanges sous 14 jours</li>
          <li>Chaque commande est confirmée</li>
        </ul>
      </section>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1, 2, 3].flatMap((copy) =>
            CATEGORIES.flatMap((category) => [
              <span key={copy + "-" + category.id}>{category.label}</span>,
              <em key={copy + "-" + category.id + "-mark"}>✦</em>,
            ])
          )}
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <p className="kicker">Les univers</p>
            <h2>Quatre gestes, une allure</h2>
            <Ornament />
          </header>
          <div className="univers-grid">
            {CATEGORIES.map((category) => (
              <Link className="univers-card" href={"/boutique/" + category.id} key={category.id}>
                <span className="univers-icon">
                  <Icon name={category.icon} />
                </span>
                <strong>{category.label}</strong>
                <em>{category.text}</em>
                <span className="card-add">Explorer</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <p className="kicker">La sélection</p>
            <h2>Pièces du moment</h2>
            <Ornament />
          </header>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <p className="section-cta">
            <Link className="btn btn-ghost" href="/boutique">
              Toute la boutique
            </Link>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="editorial">
            <div className="editorial-copy">
              <p className="kicker">La maison SN</p>
              <h2>Une allure, pas un trop-plein.</h2>
              <p>
                Le parfum se pose. Le vêtement trace la ligne. La chaussure l'ancre. L'accessoire la signe. Style & Beauté tient ces
                quatre gestes ensemble.
              </p>
              <Link className="btn btn-gold" href="/maison">
                Lire la maison
              </Link>
            </div>
            <div className="seal" aria-hidden="true">
              <span>SN</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="points">
            <article className="point">
              <h3>Sélection courte</h3>
              <p>Chaque pièce a une raison d'être ici. Rien n'est ajouté pour remplir une grille.</p>
            </article>
            <article className="point">
              <h3>Matières nettes</h3>
              <p>Soie, laine, cuir, métal et jus de parfum. Ce que l'on touche reste.</p>
            </article>
            <article className="point">
              <h3>Livraison soignée</h3>
              <p>Offerte dès {money(CONFIG.freeShipping)}. Chaque envoi est préparé à part.</p>
            </article>
            <article className="point">
              <h3>Échange simple</h3>
              <p>Quatorze jours pour changer d'avis, sans détour.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="news">
            <p className="kicker">Les nouvelles</p>
            <h2>Les prochaines pièces, avant tout le monde.</h2>
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
