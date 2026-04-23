import App from "@/features/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/dashboard/")({
  component: App,
});
