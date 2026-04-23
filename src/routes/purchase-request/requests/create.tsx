import { CreateRequestPage } from "@/features/requests/create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/requests/create")({
  component: CreateRequestPage,
});
