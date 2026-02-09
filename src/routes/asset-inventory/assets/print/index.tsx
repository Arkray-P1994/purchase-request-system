import { AssetPrintPage } from "@/features/assets/print";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/assets/print/")({
  component: AssetPrintPage,
});
