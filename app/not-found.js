import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="center-block">
          <div className="crown">
            <Icon name="crown" />
          </div>
          <h2>Cette page n'est pas dans la maison.</h2>
          <p>Le lien ne correspond à aucune pièce.</p>
          <Link className="btn btn-gold" href="/">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
