"use client";

import { useState } from "react";
import Link from "next/link";
import { CONFIG, money } from "@/lib/catalog";
import { fieldErrors } from "@/lib/form";
import { sendOrder } from "@/lib/mail";
import { useCart } from "@/components/CartProvider";
import { CartLine, ShippingNote, Totals } from "@/components/CartUI";
import { Crumbs } from "@/components/Crumbs";
import { Field } from "@/components/ContactForm";
import { Icon } from "@/components/Icons";

const REQUIRED = [
  { name: "first", label: "Prénom", auto: "given-name" },
  { name: "last", label: "Nom", auto: "family-name" },
  { name: "email", label: "E-mail", type: "email", auto: "email" },
  { name: "phone", label: "Téléphone", type: "tel", auto: "tel" },
  { name: "address", label: "Adresse", auto: "street-address" },
  { name: "zip", label: "Code postal", auto: "postal-code" },
  { name: "city", label: "Ville", auto: "address-level2" },
];

const EMPTY = {
  first: "",
  last: "",
  email: "",
  phone: "",
  address: "",
  zip: "",
  city: "",
  note: "",
};

export function Checkout() {
  const { lines, totals, order, placeOrder } = useCart();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  if (!lines.length && order) return <Success order={order} />;
  if (!lines.length) {
    return (
      <section className="section">
        <div className="wrap">
          <div className="center-block">
            <div className="crown">
              <Icon name="crown" />
            </div>
            <h2>Votre panier est vide</h2>
            <p>Choisissez une pièce dans la boutique, puis revenez pour la commander.</p>
            <Link className="btn btn-gold" href="/boutique">
              Voir la boutique
            </Link>
          </div>
        </div>
      </section>
    );
  }

  function onSubmit(event) {
    event.preventDefault();
    const next = fieldErrors(REQUIRED.map((field) => ({ ...field, value: values[field.name], required: true })));
    setErrors(next);
    if (Object.keys(next).length || !lines.length) return;
    const placed = placeOrder({
      first: values.first.trim(),
      last: values.last.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      zip: values.zip.trim(),
      city: values.city.trim(),
      note: values.note.trim(),
    });
    sendOrder(placed);
  }

  return (
    <section className="section">
      <div className="wrap">
        <Crumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Panier", href: "/boutique" },
            { label: "Commande" },
          ]}
        />
        <header className="section-head left">
          <p className="kicker">Commande</p>
          <h2>Envoyer à la maison</h2>
        </header>
        <div className="checkout-grid">
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <Field name="first" label="Prénom" auto="given-name" value={values.first} error={errors.first} onChange={setValues} />
              <Field name="last" label="Nom" auto="family-name" value={values.last} error={errors.last} onChange={setValues} />
            </div>
            <div className="form-row">
              <Field name="email" label="E-mail" type="email" auto="email" value={values.email} error={errors.email} onChange={setValues} />
              <Field name="phone" label="Téléphone" type="tel" auto="tel" value={values.phone} error={errors.phone} onChange={setValues} />
            </div>
            <Field name="address" label="Adresse" auto="street-address" value={values.address} error={errors.address} onChange={setValues} />
            <div className="form-row">
              <Field name="zip" label="Code postal" auto="postal-code" value={values.zip} error={errors.zip} onChange={setValues} />
              <Field name="city" label="Ville" auto="address-level2" value={values.city} error={errors.city} onChange={setValues} />
            </div>
            <Field
              name="note"
              label="Note"
              type="textarea"
              auto="off"
              required={false}
              maxLength={400}
              placeholder="Taille, horaire, précision"
              value={values.note}
              error=""
              onChange={setValues}
            />
            <p className="note">Aucun paiement en ligne. La maison confirme la disponibilité, puis le règlement à la livraison ou par virement.</p>
            <button className="btn btn-gold" type="submit">
              Envoyer la commande
            </button>
          </form>
          <aside className="summary">
            <h2>Récapitulatif</h2>
            {lines.map((line) => (
              <CartLine key={line.id + (line.size || "")} line={line} />
            ))}
            <ShippingNote totals={totals} />
            <Totals totals={totals} />
          </aside>
        </div>
      </div>
    </section>
  );
}

function Success({ order }) {
  const when = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <section className="section">
      <div className="wrap narrow">
        <div className="center-block">
          <div className="crown">
            <Icon name="crown" />
          </div>
          <p className="kicker">Commande {order.number}</p>
          <h2>Votre demande est prête.</h2>
          <p className="lead">Envoyez-la à la maison pour qu'elle soit confirmée. {when}.</p>
          <div className="summary flat">
            {order.lines.map((line) => (
              <div className="total-row" key={line.name + (line.size || "") + line.qty}>
                <span>
                  {line.name}
                  {line.size ? " · " + line.size : ""} × {line.qty}
                </span>
                <span>{money(line.price * line.qty)}</span>
              </div>
            ))}
            <div className="total-row">
              <span>Livraison</span>
              <span>{order.totals.shipping === 0 ? "Offerte" : money(order.totals.shipping)}</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <span>{money(order.totals.total)}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn btn-gold" onClick={() => sendOrder(order)}>
              Envoyer par e-mail
            </button>
            <Link className="btn btn-ghost" href="/boutique">
              Continuer
            </Link>
          </div>
          <p className="note">
            Si la messagerie ne s'ouvre pas, écrivez à {CONFIG.email} en indiquant le numéro {order.number}.
          </p>
        </div>
      </div>
    </section>
  );
}
