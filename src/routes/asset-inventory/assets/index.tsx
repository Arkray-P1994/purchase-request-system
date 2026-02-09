import { AssetPage } from "@/features/assets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/assets/")({
  component: AssetPage,
});
