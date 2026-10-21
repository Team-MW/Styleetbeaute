export function Icon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinejoin: "round",
    strokeLinecap: "round",
    "aria-hidden": true,
  };
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 20s-6.5-4.1-6.5-8.2A3.6 3.6 0 0 1 12 9a3.6 3.6 0 0 1 6.5 2.8C18.5 15.9 12 20 12 20z" />
      </svg>
    );
  }
  const paths = {
    bottle: (
      <>
        <path d="M10 3h4M11 3v3l-1.2 2A5 5 0 0 0 9 11v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a5 5 0 0 0-.8-3L13 6V3" />
        <path d="M9.5 14h5" />
      </>
    ),
    shirt: <path d="M8 7 4.5 9l1.8 2.4L8.5 10v9h7v-9l2.2 1.4L19.5 9 16 7l-2 2h-4L8 7z" />,
    heel: (
      <>
        <path d="M4 16c2.2-5 5-7 8.2-7 1.8 0 3 1.2 4 2.8.8 1.3.6 2.6-.2 3.2H7.2" />
        <path d="M3 19h15.5L20 16.8" />
        <path d="M8.2 16.2 6.2 19" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-.8 11H6.8L6 8z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6 6 18" />,
    crown: (
      <>
        <path d="M4 16h16l-1.3-8-4.2 3.4L12 6l-2.5 5.4L5.3 8 4 16z" />
        <path d="M6.5 18.5h11" />
      </>
    ),
    mail: (
      <>
        <rect x="3.5" y="6" width="17" height="12" />
        <path d="m4.5 7 7.5 6L19.5 7" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] || null}</svg>;
}

export function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <Icon name="heart" />
      <span />
    </div>
  );
}
