import { Fragment } from "react";
import Link from "next/link";

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Fil d'Ariane">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
