export function fieldErrors(fields) {
  const errors = {};
  fields.forEach((field) => {
    const value = String(field.value || "").trim();
    let message = "";
    if (field.required && !value) message = "Ce champ est requis.";
    else if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Indiquez un e-mail valide.";
    } else if (value && field.name === "phone" && value.length < 6) {
      message = "Indiquez un téléphone valide.";
    }
    if (message) errors[field.name] = message;
  });
  return errors;
}
