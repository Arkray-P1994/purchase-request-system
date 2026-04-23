import { ViewRequest } from "@/features/requests/components/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/requests/$requestId/")({
  component: ViewRequest,
});
