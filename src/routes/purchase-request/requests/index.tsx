import { RequestsPage } from "@/features/requests";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

const stringOrNumber = z.union([z.string(), z.number()]).transform((val) => String(val));

const requestsSearchSchema = z.object({
  filter: stringOrNumber.optional(),
  ticket_id: stringOrNumber.optional(),
  status: stringOrNumber.optional(),
  action: z.enum(["create"]).optional(),
});

export const Route = createFileRoute("/purchase-request/requests/")({
  validateSearch: (search) => requestsSearchSchema.parse(search),
  component: RequestsPage,
});
