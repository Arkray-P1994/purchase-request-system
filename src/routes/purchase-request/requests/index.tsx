import { RequestsPage } from "@/features/requests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/requests/")({
  component: RequestsPage,
});
