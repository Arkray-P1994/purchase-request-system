import { TimelinePage } from "@/features/timeline";
import { RequireAuth } from "@/features/auth/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const stringOrNumber = z.union([z.string(), z.number()]).transform((val) => String(val));

const logSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  filter: stringOrNumber.optional(),
  sort: stringOrNumber.optional(),
});

export const Route = createFileRoute("/purchase-request/timeline/")({
  component: () => (
    <RequireAuth adminOnly={true}>
      <TimelinePage />
    </RequireAuth>
  ),
  validateSearch: (search) => logSearchSchema.parse(search),
});
