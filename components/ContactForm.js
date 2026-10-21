"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/catalog";
import { fieldErrors } from "@/lib/form";
import { mail } from "@/lib/mail";
import { Icon } from "@/components/Icons";

const FIELDS = [
  { name: "first", label: "Prénom", type: "text", auto: "given-name" },
  { name: "last", label: "Nom", type: "text", auto: "family-name" },
  { name: "email", label: "E-mail", type: "email", auto: "email" },
  { name: "message", label: "Message", type: "textarea", auto: "off" },
];

export function ContactForm() {
  const [values, setValues] = useState({ first: "", last: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    const next = fieldErrors(FIELDS.map((field) => ({ ...field, value: values[field.name], required: true })));
    setErrors(next);
    if (Object.keys(next).length) return;
    mail(
      "Message — " + CONFIG.name,
      "De : " + values.first.trim() + " " + values.last.trim() + "\nE-mail : " + values.email.trim() + "\n\n" + values.message.trim()
    );
    setSent(true);
  }

  if (sent) {
    return (
      <div className="center-block in-card">
        <div className="crown">
          <Icon name="mail" />
        </div>
        <h2>Message prêt</h2>
        <p>Votre messagerie s'ouvre pour l'envoyer à la maison.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <Field name="first" label="Prénom" auto="given-name" value={values.first} error={errors.first} onChange={setValues} />
        <Field name="last" label="Nom" auto="family-name" value={values.last} error={errors.last} onChange={setValues} />
      </div>
      <Field name="email" label="E-mail" type="email" auto="email" value={values.email} error={errors.email} onChange={setValues} />
      <Field name="message" label="Message" type="textarea" auto="off" value={values.message} error={errors.message} onChange={setValues} />
      <button className="btn btn-gold" type="submit">
        Envoyer
      </button>
    </form>
  );
}

export function Field({ name, label, type = "text", auto, value, error, onChange, required = true, placeholder, maxLength }) {
  const id = "f-" + name;
  const common = {
    id,
    name,
    required,
    autoComplete: auto,
    value,
    maxLength: maxLength || (type === "textarea" ? 500 : 120),
    onChange: (event) => onChange((current) => ({ ...current, [name]: event.target.value })),
  };
  return (
    <div className={"field" + (error ? " has-error" : "")}>
      <label htmlFor={id}>{label}</label>
      {type === "textarea" ? <textarea {...common} placeholder={placeholder} /> : <input {...common} type={type} />}
      <p className="error">{error || ""}</p>
    </div>
  );
}
