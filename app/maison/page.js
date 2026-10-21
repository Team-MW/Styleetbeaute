import Link from "next/link";
import { Crumbs } from "@/components/Crumbs";

export const metadata = { title: "La maison" };

export default function MaisonPage() {
  return (
    <section className="section">
      <div className="wrap">
        <Crumbs items={[{ label: "Accueil", href: "/" }, { label: "La maison" }]} />
        <div className="story-grid">
          <div>
            <p className="kicker">La maison</p>
            <h2>Quatre univers, une seule allure.</h2>
            <p className="lead">
              Style & Beauté rassemble ce qui compose une tenue : le parfum, le vêtement, la chaussure, l'accessoire. La maison choisit
              peu, et tient chaque pièce au même niveau d'exigence.
            </p>
            <p className="lead">Rien n'est là pour suivre une semaine. Une pièce entre si elle peut durer, se porter souvent, et rester nette.</p>
            <Link className="btn btn-gold" href="/boutique">
              Entrer dans la boutique
            </Link>
          </div>
          <div className="seal seal-lg" aria-hidden="true">
            <span>SN</span>
          </div>
        </div>
        <div className="pillars">
          <article className="pillar">
            <span>I</span>
            <h3>L'œil</h3>
            <p>La ligne d'abord. Une coupe nette, un volume juste, un talon qui ne crie pas.</p>
          </article>
          <article className="pillar">
            <span>II</span>
            <h3>La matière</h3>
            <p>Ce que l'on touche reste. Cuir, soie, laine, métal, verre.</p>
          </article>
          <article className="pillar">
            <span>III</span>
            <h3>Le geste</h3>
            <p>Chaque commande est confirmée par la maison avant de partir.</p>
          </article>
        </div>
        <blockquote className="quote-block">« Le style n'est pas une accumulation. C'est une tenue. »</blockquote>
      </div>
    </section>
  );
}
