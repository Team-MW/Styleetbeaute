/* Dessins de la maison, dans l'or et le noir du sceau. */

function drawPlate(product) {
  drawPlate.seq = (drawPlate.seq || 0) + 1;
  const id = "pl" + drawPlate.seq;
  const accent = /^#[0-9a-fA-F]{6}$/.test(product.accent || "")
    ? product.accent
    : "#d4b06a";
  const metal = `url(#${id}m)`;

  return `<svg class="plate" viewBox="0 0 400 520" aria-hidden="true">
    <defs>
      <radialGradient id="${id}" cx="50%" cy="42%" r="52%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
        <stop offset="62%" stop-color="${accent}" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8e7b8"/>
        <stop offset="48%" stop-color="#e0c27a"/>
        <stop offset="100%" stop-color="#8d6830"/>
      </linearGradient>
      <linearGradient id="${id}j" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff6e8" stop-opacity="0.55"/>
        <stop offset="28%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="520" fill="#080808"/>
    <circle cx="200" cy="250" r="168" fill="url(#${id})"/>
    ${plateShape(product.plate, accent, metal, id)}
    <ellipse cx="200" cy="470" rx="92" ry="8" fill="${accent}" opacity="0.2"/>
  </svg>`;
}

function plateShape(kind, accent, metal, id) {
  const juice = `url(#${id}j)`;
  switch (kind) {
    case "perfume":
      return `
        <rect x="168" y="92" width="64" height="16" rx="2" fill="${metal}"/>
        <rect x="186" y="108" width="28" height="28" rx="1" fill="#140e0a" stroke="${metal}" stroke-width="1.2"/>
        <path d="M152 150h96" stroke="#111" stroke-width="7" stroke-linecap="round"/>
        <circle cx="168" cy="150" r="15" fill="none" stroke="#1a1a1a" stroke-width="6"/>
        <circle cx="232" cy="150" r="15" fill="none" stroke="#1a1a1a" stroke-width="6"/>
        <path d="M188 142h24" stroke="${metal}" stroke-width="1.4"/>
        <rect x="116" y="176" width="168" height="196" rx="7" fill="#120e0c" stroke="${metal}" stroke-width="1.5"/>
        <path d="M128 268h144v88a6 6 0 0 1-6 6H134a6 6 0 0 1-6-6v-88z" fill="${juice}"/>
        <rect x="132" y="268" width="16" height="94" fill="#fff" opacity="0.2"/>
        <rect x="164" y="292" width="72" height="50" rx="1" fill="#0c0c0c" stroke="${metal}" stroke-width="1"/>
        <text x="200" y="323" text-anchor="middle" fill="#e8d5a3" font-family="Georgia, serif" font-size="18" letter-spacing="2">SN</text>`;
    case "heel":
      return `
        <path d="M78 318c28-78 108-108 176-86 38 12 68 46 74 78l-28 10c-8-22-28-36-58-36-18 8-34 28-40 48l-6 62h-34l8-62c-36 6-78 10-104 2-18-6-16-16 12-16z" fill="${accent}" stroke="${metal}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M248 332l-8 64h26l14-52" fill="${metal}" opacity="0.95"/>
        <path d="M118 300c40-18 90-16 140 2" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="1.4"/>`;
    case "mule":
      return `
        <path d="M132 330c36-70 110-92 168-70 32 12 58 40 62 66l-26 8c-10-20-30-32-54-30-16 10-30 28-36 46l-4 52h-32l6-52c-8 2-40 8-70 8-8 0-18-8-14-28z" fill="${accent}" stroke="${metal}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M262 338l-6 58h24l12-48" fill="${metal}"/>
        <path d="M168 312c36-8 74-4 112 10" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.3"/>`;
    case "boot":
      return `
        <path d="M118 168h78l6 18h28c18 0 34 10 40 26l44 78c6 12 2 22-12 26l-92 8-12 62h-36l14-62H132c-28 0-40-18-28-48l14-108z" fill="${accent}" stroke="${metal}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M132 196h92M126 230h86" fill="none" stroke="${metal}" stroke-width="1.2" opacity="0.8"/>
        <path d="M250 318l8 58h28l16-46" fill="${metal}"/>`;
    case "bag":
      return `
        <path d="M118 214h164l-12 168H130z" fill="${accent}" stroke="${metal}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M150 214v-16c0-28 22-48 50-48s50 20 50 48v16" fill="none" stroke="${metal}" stroke-width="1.8"/>
        <path d="M132 248h136" stroke="${metal}" stroke-width="1.2" opacity="0.7"/>
        <rect x="176" y="262" width="48" height="34" rx="2" fill="${metal}"/>
        <path d="M192 279h16" stroke="#1a1408" stroke-width="1.4"/>`;
    case "blazer":
      return `
        <path d="M200 86c8 10 10 16 0 24-10-8-8-14 0-24z" fill="${metal}"/>
        <path d="M154 118h92l-8 14H162z" fill="none" stroke="${metal}" stroke-width="1.5"/>
        <path d="M168 128l-46 46 22 18 24-28v188h84V164l24 28 22-18-46-46-22 18h-40z" fill="${accent}" stroke="${metal}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M186 146l14 52 14-52" fill="none" stroke="${metal}" stroke-width="1.3"/>
        <path d="M200 198v146" stroke="${metal}" stroke-width="1.1" opacity="0.8"/>`;
    case "dress":
      return `
        <path d="M186 132h28l8 8-8 36h-28l-8-36z" fill="${accent}" stroke="${metal}" stroke-width="1.4"/>
        <path d="M178 176c-18 18-30 34-22 52 36 8 62 8 96 0 8-18-4-34-22-52" fill="${accent}" stroke="${metal}" stroke-width="1.4"/>
        <path d="M156 228c-8 70 4 130 18 148h52c14-18 26-78 18-148" fill="${accent}" stroke="${metal}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M192 124c-2-16 6-22 8-22M208 124c2-16-6-22-8-22" fill="none" stroke="${metal}" stroke-width="1.3"/>`;
    case "coat":
      return `
        <path d="M150 132h100l36 42-20 16-22-26v210H156V164l-22 26-20-16z" fill="${accent}" stroke="${metal}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M176 150l24 46 24-46" fill="none" stroke="${metal}" stroke-width="1.3"/>
        <path d="M200 196v186" stroke="${metal}" stroke-width="1.1"/>
        <path d="M162 248h76" stroke="${metal}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M168 132l-16-16M232 132l16-16" fill="none" stroke="${metal}" stroke-width="1.4"/>`;
    case "shirt":
      return `
        <path d="M156 156l44-22 44 22 30 62-24 12-14-36v168h-72V194l-14 36-24-12z" fill="${accent}" stroke="${metal}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M176 150l24 18 24-18" fill="none" stroke="${metal}" stroke-width="1.3"/>
        <circle cx="200" cy="214" r="2.2" fill="${metal}"/>
        <circle cx="200" cy="240" r="2.2" fill="${metal}"/>
        <circle cx="200" cy="266" r="2.2" fill="${metal}"/>
        <circle cx="200" cy="292" r="2.2" fill="${metal}"/>`;
    case "glasses":
      return `
        <circle cx="142" cy="250" r="52" fill="#102018" stroke="${metal}" stroke-width="2.4"/>
        <circle cx="258" cy="250" r="52" fill="#102018" stroke="${metal}" stroke-width="2.4"/>
        <path d="M118 236c8-16 28-24 46-16" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="1.4"/>
        <path d="M234 236c8-16 28-24 46-16" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="1.4"/>
        <path d="M194 250h12" stroke="${metal}" stroke-width="2"/>
        <path d="M90 246l-28 18" stroke="${metal}" stroke-width="2" stroke-linecap="round"/>
        <path d="M310 246l28 18" stroke="${metal}" stroke-width="2" stroke-linecap="round"/>`;
    case "bracelet":
      return `
        <ellipse cx="200" cy="268" rx="108" ry="46" fill="none" stroke="${metal}" stroke-width="10"/>
        <ellipse cx="200" cy="268" rx="86" ry="30" fill="none" stroke="${metal}" stroke-width="1.2" opacity="0.45"/>
        <circle cx="200" cy="222" r="16" fill="${metal}"/>
        <circle cx="200" cy="222" r="6" fill="#1a1408"/>`;
    case "hoops":
      return `
        <circle cx="150" cy="230" r="48" fill="none" stroke="${metal}" stroke-width="6"/>
        <circle cx="150" cy="230" r="34" fill="none" stroke="${metal}" stroke-width="1" opacity="0.4"/>
        <path d="M150 182v-18" stroke="${metal}" stroke-width="2"/>
        <circle cx="254" cy="286" r="48" fill="none" stroke="${metal}" stroke-width="6"/>
        <circle cx="254" cy="286" r="34" fill="none" stroke="${metal}" stroke-width="1" opacity="0.4"/>
        <path d="M254 238v-18" stroke="${metal}" stroke-width="2"/>`;
    default:
      return `<circle cx="200" cy="250" r="70" fill="none" stroke="${metal}" stroke-width="1.5"/>`;
  }
}
