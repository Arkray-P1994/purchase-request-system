import { TimelinePage } from "@/features/timeline";
import { RequireAuth } from "@/features/auth/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const logSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/purchase-request/timeline/")({
  component: () => (
    <RequireAuth adminOnly={true}>
      <TimelinePage />
    </RequireAuth>
  ),
  validateSearch: (search) => logSearchSchema.parse(search),
});
