import { CONFIG, money } from "@/lib/catalog";

export function mail(subject, body) {
  window.location.href =
    "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

export function orderBody(order) {
  const customer = order.customer;
  const lines = order.lines
    .map(
      (line) =>
        "• " +
        line.name +
        (line.size ? " — taille " + line.size : "") +
        " × " +
        line.qty +
        " — " +
        money(line.price * line.qty)
    )
    .join("\n");
  return [
    "Commande " + order.number,
    "",
    customer.first + " " + customer.last,
    customer.email,
    customer.phone,
    customer.address,
    customer.zip + " " + customer.city,
    "",
    lines,
    "",
    "Sous-total : " + money(order.totals.sub),
    "Livraison : " + (order.totals.shipping === 0 ? "Offerte" : money(order.totals.shipping)),
    "Total : " + money(order.totals.total),
    customer.note ? "\nNote : " + customer.note : "",
  ].join("\n");
}

export function sendOrder(order) {
  if (!order) return;
  mail("Commande " + order.number + " — " + CONFIG.name, orderBody(order));
}
