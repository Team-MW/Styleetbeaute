import { CONFIG } from "@/lib/catalog";
import { Crumbs } from "@/components/Crumbs";

export const metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  return (
    <section className="section">
      <div className="wrap prose">
        <Crumbs items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]} />
        <h2>Mentions légales</h2>
        <p>Le site {CONFIG.name} présente la sélection de la maison et permet d'adresser une demande de commande.</p>
        <p>
          Contact : <a href={"mailto:" + CONFIG.email}>{CONFIG.email}</a> · {CONFIG.phone}
        </p>
        <p>Les textes, le signe SN et l'identité visuelle de ce site appartiennent à la maison. Toute reproduction demande un accord.</p>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. Ils peuvent évoluer. Une commande n'est définitive qu'après confirmation
          de la maison.
        </p>
      </div>
    </section>
  );
}
