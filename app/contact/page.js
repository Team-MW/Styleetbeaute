import { CONFIG } from "@/lib/catalog";
import { ContactForm } from "@/components/ContactForm";
import { Crumbs } from "@/components/Crumbs";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const phoneHref = "tel:" + CONFIG.phone.replaceAll(" ", "");
  return (
    <section className="section">
      <div className="wrap">
        <Crumbs items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
        <div className="contact-grid">
          <div>
            <p className="kicker">Écrire à la maison</p>
            <h2>Une question, une taille, un sillage.</h2>
            <p className="lead">Nous répondons dans la journée, pendant les heures d'ouverture.</p>
            <ul className="contact-list">
              <li>
                <span>E-mail</span>
                <a href={"mailto:" + CONFIG.email}>{CONFIG.email}</a>
              </li>
              <li>
                <span>Téléphone</span>
                <a href={phoneHref}>{CONFIG.phone}</a>
              </li>
              <li>
                <span>Horaires</span>
                <strong>{CONFIG.hours}</strong>
              </li>
              <li>
                <span>Instagram</span>
                <strong>{CONFIG.instagram}</strong>
              </li>
            </ul>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
