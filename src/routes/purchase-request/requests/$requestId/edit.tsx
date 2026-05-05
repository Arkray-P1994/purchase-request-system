import { EditRequestPage } from "@/features/requests/edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/purchase-request/requests/$requestId/edit",
)({
  component: EditRequestPage,
});
