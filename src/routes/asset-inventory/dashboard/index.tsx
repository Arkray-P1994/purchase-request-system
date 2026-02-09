import App from "@/features/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/dashboard/")({
  component: App,
});
