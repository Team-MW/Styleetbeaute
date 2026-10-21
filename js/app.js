let cart = [];
let lastRouteKey = null;

const state = {
  sort: "featured",
  query: "",
  size: null,
  qty: 1,
  pid: null,
  order: null,
  contactSent: false,
  newsSent: false,
  menuOpen: false,
  cartOpen: false,
  focusSearch: false,
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function money(amount) {
  return new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function pieces(count) {
  return count + " pièce" + (count > 1 ? "s" : "");
}

function getProduct(id) {
  return PRODUCTS.find((item) => item.id === id);
}

function categoryById(id) {
  return CATEGORIES.find((item) => item.id === id);
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem("sb-cart") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((line) => line && getProduct(line.id) && line.qty > 0);
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("sb-cart", JSON.stringify(cart));
}

function restoreOrder() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("sb-order") || "null");
    if (saved && saved.number) state.order = saved;
  } catch (error) {
    state.order = null;
  }
}

function persistOrder() {
  if (state.order) sessionStorage.setItem("sb-order", JSON.stringify(state.order));
  else sessionStorage.removeItem("sb-order");
}

function enriched() {
  return cart
    .map((line) => {
      const product = getProduct(line.id);
      if (!product) return null;
      return { ...line, product, lineTotal: product.price * line.qty };
    })
    .filter(Boolean);
}

function totals() {
  const lines = enriched();
  const sub = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = sub === 0 || sub >= CONFIG.freeShipping ? 0 : CONFIG.shippingFee;
  return {
    sub,
    shipping,
    total: sub + shipping,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
  };
}

function lineKey(line) {
  return line.id + "__" + (line.size || "");
}

function icon(name) {
  const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"';
  const paths = {
    bottle: `<path d="M10 3h4M11 3v3l-1.2 2A5 5 0 0 0 9 11v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a5 5 0 0 0-.8-3L13 6V3"/><path d="M9.5 14h5"/>`,
    shirt: `<path d="M8 7 4.5 9l1.8 2.4L8.5 10v9h7v-9l2.2 1.4L19.5 9 16 7l-2 2h-4L8 7z"/>`,
    heel: `<path d="M4 16c2.2-5 5-7 8.2-7 1.8 0 3 1.2 4 2.8.8 1.3.6 2.6-.2 3.2H7.2"/><path d="M3 19h15.5L20 16.8"/><path d="M8.2 16.2 6.2 19"/>`,
    bag: `<path d="M6 8h12l-.8 11H6.8L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>`,
    search: `<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>`,
    close: `<path d="M6 6l12 12M18 6 6 18"/>`,
    heart: `<path fill="currentColor" stroke="none" d="M12 20s-6.5-4.1-6.5-8.2A3.6 3.6 0 0 1 12 9a3.6 3.6 0 0 1 6.5 2.8C18.5 15.9 12 20 12 20z"/>`,
    crown: `<path d="M4 16h16l-1.3-8-4.2 3.4L12 6l-2.5 5.4L5.3 8 4 16z"/><path d="M6.5 18.5h11"/>`,
    mail: `<rect x="3.5" y="6" width="17" height="12"/><path d="m4.5 7 7.5 6L19.5 7"/>`,
  };
  return `<svg ${common} aria-hidden="true">${paths[name] || ""}</svg>`;
}

function ornament() {
  return `<div class="ornament" aria-hidden="true"><span></span>${icon("heart")}<span></span></div>`;
}

function visual(product) {
  if (product.image) {
    return `<div class="visual"><img src="${esc(product.image)}" alt=""></div>`;
  }
  return `<div class="visual">${drawPlate(product)}</div>`;
}

function productCard(product) {
  const href = "#/produit/" + product.id;
  const action = product.sizes
    ? `<a class="card-add" href="${href}">Choisir</a>`
    : `<button type="button" class="card-add" data-action="add" data-id="${product.id}" data-qty="1">Ajouter</button>`;
  return `<article class="card">
    <a class="card-media" href="${href}" aria-label="${esc(product.name)}">
      ${product.badge ? `<span class="card-badge">${esc(product.badge)}</span>` : ""}
      ${visual(product)}
    </a>
    <div class="card-body">
      <p class="card-kicker">${esc(categoryById(product.category).label)}</p>
      <h3><a href="${href}">${esc(product.name)}</a></h3>
      <p class="card-meta">${esc(product.subtitle)}</p>
      <div class="card-row">
        <span class="price">${money(product.price)}</span>
        ${action}
      </div>
    </div>
  </article>`;
}

function parseRoute() {
  const raw = (location.hash || "#/").replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : "/";
  const parts = path.split("/").filter(Boolean);
  const head = parts[0] || "home";
  if (head === "home") return { name: "home" };
  if (head === "boutique") return { name: "shop", category: parts[1] || "tous" };
  if (head === "produit" && parts[1]) return { name: "product", id: decodeURIComponent(parts[1]) };
  if (head === "maison") return { name: "about" };
  if (head === "contact") return { name: "contact" };
  if (head === "commande") return { name: "checkout" };
  if (head === "mentions") return { name: "legal" };
  if (head === "confidentialite") return { name: "privacy" };
  return { name: "notfound" };
}

function activeCategory(route) {
  if (route.name !== "shop") return "tous";
  return categoryById(route.category) ? route.category : "tous";
}

function visibleProducts() {
  const route = parseRoute();
  const category = activeCategory(route);
  const query = state.query.trim().toLowerCase();
  const list = PRODUCTS.filter((product) => {
    if (category !== "tous" && product.category !== category) return false;
    if (!query) return true;
    const blob = [
      product.name,
      product.subtitle,
      product.description,
      categoryById(product.category).label,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(query);
  });
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return list;
}

function shopResultsHTML() {
  const list = visibleProducts();
  if (!list.length) {
    return `<div class="empty-shop"><p>Aucune pièce ne correspond.</p><a href="#/boutique">Voir toute la boutique</a></div>`;
  }
  return list.map((product) => productCard(product)).join("");
}

function crumbs(items) {
  return `<nav class="crumbs" aria-label="Fil d'Ariane">${items
    .map((item, index) => {
      const node = item.href ? `<a href="${item.href}">${esc(item.label)}</a>` : `<span aria-current="page">${esc(item.label)}</span>`;
      return index ? `<span aria-hidden="true">/</span>${node}` : node;
    })
    .join("")}</nav>`;
}

function renderHome() {
  const featured = PRODUCTS.filter((product) => product.featured);
  return `<section class="hero">
      <img class="hero-logo" src="assets/logo.jpg" alt="Style &amp; Beauté — parfums, vêtements, chaussures, accessoires" fetchpriority="high">
      <p class="hero-tag">L'élégance, au quotidien.</p>
      <p class="hero-lead">Parfums, vêtements, chaussures et accessoires réunis dans une même maison. Peu de pièces, choisies pour leur ligne.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#/boutique">Découvrir la boutique</a>
        <a class="btn btn-ghost" href="#/maison">La maison</a>
      </div>
      <ul class="hero-notes">
        <li>Livraison offerte dès ${money(CONFIG.freeShipping)}</li>
        <li>Échanges sous 14 jours</li>
        <li>Chaque commande est confirmée</li>
      </ul>
    </section>
    <div class="marquee" aria-hidden="true"><div class="marquee-track">${marqueeTrack()}</div></div>
    <section class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="kicker">Les univers</p>
          <h2>Quatre gestes, une allure</h2>
          ${ornament()}
        </header>
        <div class="univers-grid">
          ${CATEGORIES.map(
            (category) => `<a class="univers-card" href="#/boutique/${category.id}">
              <span class="univers-icon">${icon(category.icon)}</span>
              <strong>${esc(category.label)}</strong>
              <em>${esc(category.text)}</em>
              <span class="card-add">Explorer</span>
            </a>`
          ).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="kicker">La sélection</p>
          <h2>Pièces du moment</h2>
          ${ornament()}
        </header>
        <div class="product-grid">${featured.map((product) => productCard(product)).join("")}</div>
        <p class="section-cta"><a class="btn btn-ghost" href="#/boutique">Toute la boutique</a></p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="editorial">
          <div class="editorial-copy">
            <p class="kicker">La maison SN</p>
            <h2>Une allure, pas un trop-plein.</h2>
            <p>Le parfum se pose. Le vêtement trace la ligne. La chaussure l'ancre. L'accessoire la signe. Style &amp; Beauté tient ces quatre gestes ensemble.</p>
            <a class="btn btn-gold" href="#/maison">Lire la maison</a>
          </div>
          <div class="seal" aria-hidden="true"><span>SN</span></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="points">
          <article class="point"><h3>Sélection courte</h3><p>Chaque pièce a une raison d'être ici. Rien n'est ajouté pour remplir une grille.</p></article>
          <article class="point"><h3>Matières nettes</h3><p>Soie, laine, cuir, métal et jus de parfum. Ce que l'on touche reste.</p></article>
          <article class="point"><h3>Livraison soignée</h3><p>Offerte dès ${money(CONFIG.freeShipping)}. Chaque envoi est préparé à part.</p></article>
          <article class="point"><h3>Échange simple</h3><p>Quatorze jours pour changer d'avis, sans détour.</p></article>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="news">
          <p class="kicker">Les nouvelles</p>
          <h2>Les prochaines pièces, avant tout le monde.</h2>
          ${
            state.newsSent
              ? `<p class="thanks">Merci. Votre messagerie s'ouvre pour confirmer l'inscription.</p>`
              : `<form id="news-form" class="news-form">
                  <div>
                    <input type="email" name="email" required placeholder="Votre e-mail" aria-label="Adresse e-mail" autocomplete="email">
                    <p class="error"></p>
                  </div>
                  <button class="btn btn-gold" type="submit">S'inscrire</button>
                </form>`
          }
        </div>
      </div>
    </section>`;
}

function marqueeTrack() {
  const unit = CATEGORIES.map((category) => `<span>${category.label}</span><em>✦</em>`).join("");
  return unit + unit + unit + unit;
}

function renderShop() {
  const route = parseRoute();
  const category = activeCategory(route);
  const current = categoryById(category);
  const title = current ? current.label : "La boutique";
  const text = current
    ? current.text
    : "Parfums, vêtements, chaussures et accessoires. Une sélection courte, pour une allure nette.";
  const list = visibleProducts();
  const crumb = [{ label: "Accueil", href: "#/" }, { label: "Boutique", href: "#/boutique" }];
  if (current) crumb.push({ label: current.label });
  return `<section class="section shop">
    <div class="wrap">
      ${crumbs(crumb)}
      <header class="section-head">
        <p class="kicker">Boutique</p>
        <h2>${esc(title)}</h2>
        <p class="hero-lead">${esc(text)}</p>
      </header>
      <div class="toolbar">
        <label class="search">${icon("search")}
          <input id="search" type="search" placeholder="Rechercher une pièce" value="${esc(state.query)}" autocomplete="off">
        </label>
        <select id="sort" class="sort-select" aria-label="Trier">
          <option value="featured" ${state.sort === "featured" ? "selected" : ""}>Mise en avant</option>
          <option value="price-asc" ${state.sort === "price-asc" ? "selected" : ""}>Prix croissant</option>
          <option value="price-desc" ${state.sort === "price-desc" ? "selected" : ""}>Prix décroissant</option>
          <option value="name" ${state.sort === "name" ? "selected" : ""}>Nom</option>
        </select>
      </div>
      <div class="chips">
        <a class="chip ${category === "tous" ? "is-on" : ""}" href="#/boutique">Tous</a>
        ${CATEGORIES.map(
          (item) => `<a class="chip ${category === item.id ? "is-on" : ""}" href="#/boutique/${item.id}">${esc(item.label)}</a>`
        ).join("")}
      </div>
      <p class="results-meta" id="results-meta">${list.length ? pieces(list.length) : "Aucun résultat"}</p>
      <div class="product-grid" id="product-grid">${shopResultsHTML()}</div>
    </div>
  </section>`;
}

function renderProduct() {
  const product = getProduct(parseRoute().id);
  if (!product) {
    return emptyBlock("Pièce introuvable", "Cette référence n'est plus dans la sélection.", "#/boutique", "Retour à la boutique");
  }
  const category = categoryById(product.category);
  const related = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  return `<section class="section">
    <div class="wrap">
      ${crumbs([
        { label: "Accueil", href: "#/" },
        { label: "Boutique", href: "#/boutique" },
        { label: category.label, href: "#/boutique/" + category.id },
        { label: product.name },
      ])}
      <div class="product-layout">
        <div class="product-gallery">
          ${product.badge ? `<span class="badge">${esc(product.badge)}</span>` : ""}
          ${visual(product)}
        </div>
        <div class="product-info">
          <p class="kicker">${esc(category.label)}</p>
          <h2>${esc(product.name)}</h2>
          <p class="product-price">${money(product.price)}</p>
          <p class="lead">${esc(product.description)}</p>
          ${sizePicker(product)}
          <div class="buy-row">
            <div class="qty">
              <button type="button" data-action="pqty" data-dir="-1" aria-label="Diminuer la quantité">−</button>
              <span id="pqty">${state.qty}</span>
              <button type="button" data-action="pqty" data-dir="1" aria-label="Augmenter la quantité">+</button>
            </div>
            <button type="button" class="btn btn-gold" data-action="add" data-id="${product.id}">Ajouter au panier</button>
          </div>
          <p class="note">Disponible. Expédition après confirmation de la maison.</p>
          <dl class="facts">
            ${product.facts.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}
          </dl>
        </div>
      </div>
      <header class="section-head related-head">
        <p class="kicker">Dans le même univers</p>
        <h2>À porter avec</h2>
      </header>
      <div class="product-grid is-3">${related.map((item) => productCard(item)).join("")}</div>
    </div>
  </section>`;
}

function sizePicker(product) {
  if (!product.sizes) return "";
  return `<div class="sizes">
    <div class="sizes-label"><span>Taille</span><span class="size-error" id="size-error"></span></div>
    <div class="size-list">
      ${product.sizes
        .map(
          (size) =>
            `<button type="button" class="size-btn ${state.size === size ? "is-on" : ""}" data-action="size" data-size="${esc(size)}" aria-pressed="${state.size === size}">${esc(size)}</button>`
        )
        .join("")}
    </div>
  </div>`;
}

function renderAbout() {
  return `<section class="section">
    <div class="wrap">
      ${crumbs([{ label: "Accueil", href: "#/" }, { label: "La maison" }])}
      <div class="story-grid">
        <div>
          <p class="kicker">La maison</p>
          <h2>Quatre univers, une seule allure.</h2>
          <p class="lead">Style &amp; Beauté rassemble ce qui compose une tenue : le parfum, le vêtement, la chaussure, l'accessoire. La maison choisit peu, et tient chaque pièce au même niveau d'exigence.</p>
          <p class="lead">Rien n'est là pour suivre une semaine. Une pièce entre si elle peut durer, se porter souvent, et rester nette.</p>
          <a class="btn btn-gold" href="#/boutique">Entrer dans la boutique</a>
        </div>
        <div class="seal seal-lg" aria-hidden="true"><span>SN</span></div>
      </div>
      <div class="pillars">
        <article class="pillar"><span>I</span><h3>L'œil</h3><p>La ligne d'abord. Une coupe nette, un volume juste, un talon qui ne crie pas.</p></article>
        <article class="pillar"><span>II</span><h3>La matière</h3><p>Ce que l'on touche reste. Cuir, soie, laine, métal, verre.</p></article>
        <article class="pillar"><span>III</span><h3>Le geste</h3><p>Chaque commande est confirmée par la maison avant de partir.</p></article>
      </div>
      <blockquote class="quote-block">« Le style n'est pas une accumulation. C'est une tenue. »</blockquote>
    </div>
  </section>`;
}

function renderContact() {
  return `<section class="section">
    <div class="wrap">
      ${crumbs([{ label: "Accueil", href: "#/" }, { label: "Contact" }])}
      <div class="contact-grid">
        <div>
          <p class="kicker">Écrire à la maison</p>
          <h2>Une question, une taille, un sillage.</h2>
          <p class="lead">Nous répondons dans la journée, pendant les heures d'ouverture.</p>
          <ul class="contact-list">
            <li><span>E-mail</span><a id="contact-email" href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li>
            <li><span>Téléphone</span><a href="tel:${esc(CONFIG.phone.replaceAll(" ", ""))}">${esc(CONFIG.phone)}</a></li>
            <li><span>Horaires</span><strong>${esc(CONFIG.hours)}</strong></li>
            <li><span>Instagram</span><strong>${esc(CONFIG.instagram)}</strong></li>
          </ul>
        </div>
        <div>
          ${
            state.contactSent
              ? `<div class="center-block in-card"><div class="crown">${icon("mail")}</div><h2>Message prêt</h2><p>Votre messagerie s'ouvre pour l'envoyer à la maison.</p></div>`
              : `<form id="contact-form" class="form" novalidate>
                  <div class="form-row">
                    ${field("Prénom", "first", "text", "given-name")}
                    ${field("Nom", "last", "text", "family-name")}
                  </div>
                  ${field("E-mail", "email", "email", "email")}
                  ${field("Message", "message", "textarea", "off")}
                  <button class="btn btn-gold" type="submit">Envoyer</button>
                </form>`
          }
        </div>
      </div>
    </div>
  </section>`;
}

function field(label, name, type, auto) {
  const control =
    type === "textarea"
      ? `<textarea id="f-${name}" name="${name}" required maxlength="500" autocomplete="${auto}"></textarea>`
      : `<input id="f-${name}" name="${name}" type="${type}" required maxlength="120" autocomplete="${auto}">`;
  return `<div class="field"><label for="f-${name}">${label}</label>${control}<p class="error"></p></div>`;
}

function renderCheckout() {
  if (!cart.length && state.order) return renderSuccess();
  if (!cart.length) {
    return emptyBlock(
      "Votre panier est vide",
      "Choisissez une pièce dans la boutique, puis revenez pour la commander.",
      "#/boutique",
      "Voir la boutique"
    );
  }
  return `<section class="section">
    <div class="wrap">
      ${crumbs([{ label: "Accueil", href: "#/" }, { label: "Panier", href: "#/boutique" }, { label: "Commande" }])}
      <header class="section-head left">
        <p class="kicker">Commande</p>
        <h2>Envoyer à la maison</h2>
      </header>
      <div class="checkout-grid">
        <form id="checkout-form" class="form" novalidate>
          <div class="form-row">
            ${field("Prénom", "first", "text", "given-name")}
            ${field("Nom", "last", "text", "family-name")}
          </div>
          <div class="form-row">
            ${field("E-mail", "email", "email", "email")}
            ${field("Téléphone", "phone", "tel", "tel")}
          </div>
          ${field("Adresse", "address", "text", "street-address")}
          <div class="form-row">
            ${field("Code postal", "zip", "text", "postal-code")}
            ${field("Ville", "city", "text", "address-level2")}
          </div>
          <div class="field">
            <label for="f-note">Note</label>
            <textarea id="f-note" name="note" maxlength="400" placeholder="Taille, horaire, précision"></textarea>
            <p class="error"></p>
          </div>
          <p class="note">Aucun paiement en ligne. La maison confirme la disponibilité, puis le règlement à la livraison ou par virement.</p>
          <button class="btn btn-gold" id="checkout-submit" type="submit">Envoyer la commande</button>
        </form>
        <aside class="summary" id="summary-slot">${summaryInnerHTML()}</aside>
      </div>
    </div>
  </section>`;
}

function renderSuccess() {
  const order = state.order;
  const when = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `<section class="section">
    <div class="wrap narrow">
      <div class="center-block">
        <div class="crown">${icon("crown")}</div>
        <p class="kicker">Commande ${esc(order.number)}</p>
        <h2>Votre demande est prête.</h2>
        <p class="lead">Envoyez-la à la maison pour qu'elle soit confirmée. ${esc(when)}.</p>
        <div class="summary flat">
          ${order.lines
            .map(
              (line) =>
                `<div class="total-row"><span>${esc(line.name)}${line.size ? " · " + esc(line.size) : ""} × ${line.qty}</span><span>${money(line.price * line.qty)}</span></div>`
            )
            .join("")}
          <div class="total-row"><span>Livraison</span><span>${order.totals.shipping === 0 ? "Offerte" : money(order.totals.shipping)}</span></div>
          <div class="total-row grand"><span>Total</span><span>${money(order.totals.total)}</span></div>
        </div>
        <div class="hero-actions">
          <button type="button" class="btn btn-gold" data-action="send-order">Envoyer par e-mail</button>
          <a class="btn btn-ghost" href="#/boutique">Continuer</a>
        </div>
        <p class="note">Si la messagerie ne s'ouvre pas, écrivez à ${esc(CONFIG.email)} en indiquant le numéro ${esc(order.number)}.</p>
      </div>
    </div>
  </section>`;
}

function renderLegal() {
  return prose(
    "Mentions légales",
    `<p>Le site ${esc(CONFIG.name)} présente la sélection de la maison et permet d'adresser une demande de commande.</p>
     <p>Contact : <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a> · ${esc(CONFIG.phone)}</p>
     <p>Les textes, le signe SN et l'identité visuelle de ce site appartiennent à la maison. Toute reproduction demande un accord.</p>
     <p>Les prix sont indiqués en euros, toutes taxes comprises. Ils peuvent évoluer. Une commande n'est définitive qu'après confirmation de la maison.</p>`
  );
}

function renderPrivacy() {
  return prose(
    "Confidentialité",
    `<p>Les informations que vous transmettez — identité, coordonnées, contenu du message ou de la commande — servent uniquement à vous répondre et à préparer votre demande.</p>
     <p>Elles partent par votre propre messagerie, à l'adresse de la maison. Elles ne sont pas vendues.</p>
     <p>Pour faire rectifier ou supprimer un échange, écrivez à <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>.</p>`
  );
}

function prose(title, body) {
  return `<section class="section"><div class="wrap prose">
    ${crumbs([{ label: "Accueil", href: "#/" }, { label: title }])}
    <h2>${esc(title)}</h2>
    ${body}
  </div></section>`;
}

function emptyBlock(title, text, href, label) {
  return `<section class="section"><div class="wrap"><div class="center-block">
    <div class="crown">${icon("crown")}</div>
    <h2>${title}</h2>
    <p>${text}</p>
    <a class="btn btn-gold" href="${href}">${label}</a>
  </div></div></section>`;
}

function pageHTML(route) {
  switch (route.name) {
    case "home":
      return renderHome();
    case "shop":
      return renderShop();
    case "product":
      return renderProduct();
    case "about":
      return renderAbout();
    case "contact":
      return renderContact();
    case "checkout":
      return renderCheckout();
    case "legal":
      return renderLegal();
    case "privacy":
      return renderPrivacy();
    default:
      return emptyBlock("Cette page n'est pas dans la maison.", "Le lien ne correspond à aucune pièce.", "#/", "Retour à l'accueil");
  }
}

function titleFor(route) {
  const base = CONFIG.name;
  if (route.name === "home") return base + " — Parfums, vêtements, chaussures, accessoires";
  if (route.name === "shop") {
    const category = categoryById(activeCategory(route));
    return (category ? category.label : "Boutique") + " — " + base;
  }
  if (route.name === "product") {
    const product = getProduct(route.id);
    return (product ? product.name : "Pièce") + " — " + base;
  }
  const names = {
    about: "La maison",
    contact: "Contact",
    checkout: "Commande",
    legal: "Mentions légales",
    privacy: "Confidentialité",
  };
  return (names[route.name] || base) + " — " + base;
}

function render() {
  const route = parseRoute();
  const key = location.hash || "#/";
  const changed = key !== lastRouteKey;
  if (changed) {
    const fromShop = lastRouteKey === "#/boutique" || (lastRouteKey || "").startsWith("#/boutique/");
    const toShop = route.name === "shop";
    if (fromShop && !toShop) state.query = "";
    if (route.name !== "contact") state.contactSent = false;
    const pid = route.name === "product" ? route.id : null;
    if (pid !== state.pid) {
      state.size = null;
      state.qty = 1;
      state.pid = pid;
    }
    closeMenu();
    closeCart();
    if (lastRouteKey !== null) window.scrollTo(0, 0);
    lastRouteKey = key;
  }
  document.getElementById("app").innerHTML = `<div class="view ${changed ? "" : "no-anim"}">${pageHTML(route)}</div>`;
  const current = route.name === "product" || route.name === "checkout" ? "shop" : route.name;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const on = link.dataset.nav === current;
    link.classList.toggle("is-active", on);
    if (on) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = titleFor(route);
  if (state.focusSearch) {
    const input = document.getElementById("search");
    if (input) {
      input.focus();
      state.focusSearch = false;
    }
  }
}

function renderShopResults() {
  const grid = document.getElementById("product-grid");
  const meta = document.getElementById("results-meta");
  if (!grid || !meta) {
    render();
    return;
  }
  const list = visibleProducts();
  meta.textContent = list.length ? pieces(list.length) : "Aucun résultat";
  grid.innerHTML = shopResultsHTML();
}

function cartLineHTML(line) {
  const product = line.product;
  const key = lineKey(line);
  return `<article class="cart-line">
    <a href="#/produit/${product.id}">${visual(product)}</a>
    <div class="cart-line-body">
      <div class="card-row">
        <strong><a href="#/produit/${product.id}">${esc(product.name)}</a></strong>
        <span>${money(line.lineTotal)}</span>
      </div>
      <p class="card-meta">${esc(product.subtitle)}${line.size ? " · Taille " + esc(line.size) : ""}</p>
      <div class="card-row">
        <div class="qty">
          <button type="button" data-action="qty" data-key="${key}" data-dir="-1" aria-label="Diminuer">−</button>
          <span>${line.qty}</span>
          <button type="button" data-action="qty" data-key="${key}" data-dir="1" aria-label="Augmenter">+</button>
        </div>
        <button type="button" class="text-btn" data-action="remove" data-key="${key}">Retirer</button>
      </div>
    </div>
  </article>`;
}

function shippingNote(total) {
  if (total.sub <= 0) return "";
  if (total.shipping === 0) {
    return `<p class="ship-ok">Livraison offerte</p><div class="bar" aria-hidden="true"><span style="width:100%"></span></div>`;
  }
  const ratio = Math.min(100, Math.round((total.sub / CONFIG.freeShipping) * 100));
  const missing = CONFIG.freeShipping - total.sub;
  return `<p class="ship-ok">Plus que ${money(missing)} pour la livraison offerte.</p><div class="bar" aria-hidden="true"><span style="width:${ratio}%"></span></div>`;
}

function totalsHTML(total) {
  return `<div class="total-row"><span>Sous-total</span><span>${money(total.sub)}</span></div>
    <div class="total-row"><span>Livraison</span><span>${total.shipping === 0 ? "Offerte" : money(total.shipping)}</span></div>
    <div class="total-row grand"><span>Total</span><span>${money(total.total)}</span></div>`;
}

function summaryInnerHTML() {
  const lines = enriched();
  if (!lines.length) return `<p class="cart-empty">Votre panier est vide.</p>`;
  const total = totals();
  return `<h2>Récapitulatif</h2>${lines.map(cartLineHTML).join("")}${shippingNote(total)}${totalsHTML(total)}`;
}

function renderDrawer() {
  const lines = enriched();
  const body = document.getElementById("drawer-body");
  const foot = document.getElementById("drawer-foot");
  if (!lines.length) {
    body.innerHTML = `<div class="cart-empty"><div class="crown">${icon("bag")}</div><p>Votre panier est vide.</p><a class="btn btn-ghost" href="#/boutique">Découvrir la boutique</a></div>`;
    foot.innerHTML = "";
    return;
  }
  const total = totals();
  body.innerHTML = lines.map(cartLineHTML).join("");
  foot.innerHTML = `${shippingNote(total)}${totalsHTML(total)}
    <a class="btn btn-gold btn-full" href="#/commande">Commander</a>
    <button type="button" class="btn btn-ghost btn-full" data-action="close-cart">Continuer</button>`;
}

let lastCount = 0;
let countReady = false;

function updateCount() {
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const badge = document.getElementById("cart-count");
  badge.textContent = String(count);
  badge.classList.toggle("is-empty", count === 0);
  if (countReady && count !== lastCount) {
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }
  lastCount = count;
  countReady = true;
}

function updateCartUI() {
  updateCount();
  renderDrawer();
  const slot = document.getElementById("summary-slot");
  if (slot) slot.innerHTML = summaryInnerHTML();
  const submit = document.getElementById("checkout-submit");
  if (submit) submit.disabled = cart.length === 0;
}

function openCart() {
  state.cartOpen = true;
  document.getElementById("drawer").classList.add("is-open");
  document.getElementById("drawer").setAttribute("aria-hidden", "false");
  document.getElementById("overlay").classList.add("is-open");
  syncLock();
}

function closeCart() {
  state.cartOpen = false;
  const drawer = document.getElementById("drawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.getElementById("overlay").classList.remove("is-open");
  syncLock();
}

function closeMenu() {
  state.menuOpen = false;
  document.getElementById("nav").classList.remove("is-open");
  document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
  syncLock();
}

function syncLock() {
  document.body.classList.toggle("locked", state.menuOpen || state.cartOpen);
}

let toastTimer = 0;
function toast(message) {
  const el = document.getElementById("toast");
  document.getElementById("toast-text").textContent = message;
  el.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("is-on"), 3400);
}

function addToCart(id, size, qty) {
  state.order = null;
  persistOrder();
  const chosen = size || null;
  const line = cart.find((item) => item.id === id && (item.size || null) === chosen);
  if (line) line.qty = Math.min(8, line.qty + qty);
  else cart.push({ id, size: chosen, qty });
  saveCart();
  updateCartUI();
  const product = getProduct(id);
  toast("Ajouté au panier · " + product.name + (chosen ? " · " + chosen : ""));
}

function findLine(key) {
  const split = key.split("__");
  const id = split[0];
  const size = split[1] || null;
  return cart.find((line) => line.id === id && (line.size || null) === (size || null));
}

function mail(subject, body) {
  window.location.href =
    "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

function orderBody(order) {
  const customer = order.customer;
  const lines = order.lines
    .map((line) => "• " + line.name + (line.size ? " — taille " + line.size : "") + " × " + line.qty + " — " + money(line.price * line.qty))
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

function sendOrder() {
  if (!state.order) return;
  mail("Commande " + state.order.number + " — " + CONFIG.name, orderBody(state.order));
}

function validate(form) {
  let ok = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const wrap = input.closest(".field");
    const error = wrap.querySelector(".error");
    let message = "";
    const value = input.value.trim();
    if (!value) message = "Ce champ est requis.";
    else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Indiquez un e-mail valide.";
    else if (input.name === "phone" && value.length < 6) message = "Indiquez un téléphone valide.";
    error.textContent = message;
    wrap.classList.toggle("has-error", Boolean(message));
    if (message) ok = false;
  });
  return ok;
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "open-cart") {
    openCart();
    document.getElementById("toast").classList.remove("is-on");
  } else if (action === "close-cart") {
    closeCart();
  } else if (action === "toggle-menu") {
    state.menuOpen = !state.menuOpen;
    document.getElementById("nav").classList.toggle("is-open", state.menuOpen);
    button.setAttribute("aria-expanded", String(state.menuOpen));
    document.body.classList.toggle("nav-open", state.menuOpen);
    syncLock();
  } else if (action === "focus-search") {
    state.focusSearch = true;
    if ((location.hash || "#/") === "#/boutique") {
      const input = document.getElementById("search");
      if (input) input.focus();
    }
  } else if (action === "size") {
    state.size = button.dataset.size;
    document.querySelectorAll(".size-btn").forEach((item) => {
      const on = item.dataset.size === state.size;
      item.classList.toggle("is-on", on);
      item.setAttribute("aria-pressed", String(on));
    });
    const error = document.getElementById("size-error");
    if (error) error.textContent = "";
  } else if (action === "pqty") {
    state.qty = Math.min(8, Math.max(1, state.qty + Number(button.dataset.dir)));
    const label = document.getElementById("pqty");
    if (label) label.textContent = String(state.qty);
  } else if (action === "add") {
    const product = getProduct(button.dataset.id);
    if (!product) return;
    if (product.sizes && !state.size && !button.dataset.qty) {
      const error = document.getElementById("size-error");
      const list = document.querySelector(".size-list");
      if (error) error.textContent = "Choisissez une taille.";
      if (list) {
        list.classList.remove("shake");
        void list.offsetWidth;
        list.classList.add("shake");
      }
      return;
    }
    const qty = button.dataset.qty ? Number(button.dataset.qty) : state.qty;
    addToCart(product.id, product.sizes ? state.size : null, qty);
  } else if (action === "qty" || action === "remove") {
    const line = findLine(button.dataset.key);
    if (!line) return;
    if (action === "remove") cart.splice(cart.indexOf(line), 1);
    else line.qty = Math.min(8, Math.max(1, line.qty + Number(button.dataset.dir)));
    saveCart();
    updateCartUI();
    if (!cart.length && parseRoute().name === "checkout" && !state.order) render();
  } else if (action === "send-order") {
    sendOrder();
  }
}

function onSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "news-form") {
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector(".error").textContent = "Indiquez un e-mail valide.";
      return;
    }
    state.newsSent = true;
    mail("Inscription aux nouvelles — " + CONFIG.name, "Bonjour,\n\nJe souhaite recevoir les nouvelles de la maison.\n\nE-mail : " + email + "\n");
    render();
    return;
  }
  if (form.id === "contact-form") {
    event.preventDefault();
    if (!validate(form)) return;
    const data = new FormData(form);
    mail(
      "Message — " + CONFIG.name,
      "De : " + data.get("first") + " " + data.get("last") + "\nE-mail : " + data.get("email") + "\n\n" + data.get("message")
    );
    state.contactSent = true;
    render();
    return;
  }
  if (form.id === "checkout-form") {
    event.preventDefault();
    if (!cart.length || !validate(form)) return;
    const data = new FormData(form);
    const lines = enriched();
    const total = totals();
    state.order = {
      number: "SN-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      customer: {
        first: String(data.get("first") || "").trim(),
        last: String(data.get("last") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        address: String(data.get("address") || "").trim(),
        zip: String(data.get("zip") || "").trim(),
        city: String(data.get("city") || "").trim(),
        note: String(data.get("note") || "").trim(),
      },
      lines: lines.map((line) => ({
        name: line.product.name,
        size: line.size,
        qty: line.qty,
        price: line.product.price,
      })),
      totals: total,
    };
    cart = [];
    saveCart();
    persistOrder();
    updateCartUI();
    render();
    sendOrder();
  }
}

function applyConfig() {
  const email = document.getElementById("footer-email");
  email.textContent = CONFIG.email;
  email.href = "mailto:" + CONFIG.email;
  document.getElementById("footer-phone").textContent = CONFIG.phone;
  document.getElementById("footer-phone").href = "tel:" + CONFIG.phone.replaceAll(" ", "");
  document.getElementById("footer-hours").textContent = CONFIG.hours;
  document.getElementById("footer-instagram").textContent = CONFIG.instagram;
  document.getElementById("year").textContent = String(new Date().getFullYear());
}

function bind() {
  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", (event) => {
    if (event.target.id === "search") {
      state.query = event.target.value;
      renderShopResults();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "sort") {
      state.sort = event.target.value;
      renderShopResults();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (state.cartOpen) closeCart();
    else if (state.menuOpen) closeMenu();
  });
  window.addEventListener("hashchange", () => render());
  document.addEventListener(
    "error",
    (event) => {
      if (event.target && event.target.tagName === "IMG") event.target.classList.add("is-broken");
    },
    true
  );
}

function init() {
  cart = loadCart();
  restoreOrder();
  applyConfig();
  bind();
  render();
  updateCartUI();
}

init();
