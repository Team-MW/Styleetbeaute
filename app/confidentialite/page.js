import { CONFIG } from "@/lib/catalog";
import { Crumbs } from "@/components/Crumbs";

export const metadata = { title: "Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <section className="section">
      <div className="wrap prose">
        <Crumbs items={[{ label: "Accueil", href: "/" }, { label: "Confidentialité" }]} />
        <h2>Confidentialité</h2>
        <p>
          Les informations que vous transmettez — identité, coordonnées, contenu du message ou de la commande — servent uniquement à vous
          répondre et à préparer votre demande.
        </p>
        <p>Elles partent par votre propre messagerie, à l'adresse de la maison. Elles ne sont pas vendues.</p>
        <p>
          Pour faire rectifier ou supprimer un échange, écrivez à <a href={"mailto:" + CONFIG.email}>{CONFIG.email}</a>.
        </p>
      </div>
    </section>
  );
}
