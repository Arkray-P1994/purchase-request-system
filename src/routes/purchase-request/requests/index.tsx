import { RequestsPage } from "@/features/requests";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

const requestsSearchSchema = z.object({
  filter: z.string().optional(),
  ticket_id: z.string().optional(),
  status: z.string().optional(),
  requestId: z.string().optional(),
  action: z.enum(["create", "edit"]).optional(),
});

export const Route = createFileRoute("/purchase-request/requests/")({
  validateSearch: (search) => requestsSearchSchema.parse(search),
  component: RequestsPage,
});
