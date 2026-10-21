import { Suspense } from "react";
import { Shop } from "@/components/Shop";

export const metadata = { title: "Boutique" };

export default function BoutiquePage() {
  return (
    <Suspense fallback={null}>
      <Shop category="tous" />
    </Suspense>
  );
}
