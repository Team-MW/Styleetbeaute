"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/catalog";
import { fieldErrors } from "@/lib/form";
import { mail } from "@/lib/mail";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const errors = fieldErrors([{ name: "email", value: email, type: "email", required: true }]);
    if (errors.email) {
      setError(errors.email);
      return;
    }
    setError("");
    setSent(true);
    mail(
      "Inscription aux nouvelles — " + CONFIG.name,
      "Bonjour,\n\nJe souhaite recevoir les nouvelles de la maison.\n\nE-mail : " + email.trim() + "\n"
    );
  }

  if (sent) {
    return <p className="thanks">Merci. Votre messagerie s'ouvre pour confirmer l'inscription.</p>;
  }

  return (
    <form className="news-form" onSubmit={onSubmit} noValidate>
      <div className={error ? "has-error" : ""}>
        <input
          type="email"
          name="email"
          required
          placeholder="Votre e-mail"
          aria-label="Adresse e-mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <p className="error">{error}</p>
      </div>
      <button className="btn btn-gold" type="submit">
        S'inscrire
      </button>
    </form>
  );
}
