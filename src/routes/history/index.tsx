import MainLayout from "@/components/layout/mainLayout";
import { ActivityLogsPage } from "@/features/activity-logs";
import { AuthProvider, RequireAuth } from "@/features/auth/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const stringOrNumber = z.union([z.string(), z.number()]).transform((val) => String(val));

const logSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  filter: stringOrNumber.optional(),
  sort: stringOrNumber.optional(),
});

export const Route = createFileRoute("/history/")({
  component: HistoryLayout,
  validateSearch: (search) => logSearchSchema.parse(search),
});

function HistoryLayout() {
  return (
    <AuthProvider>
      <RequireAuth adminOnly={true}>
        <MainLayout>
          <ActivityLogsPage />
        </MainLayout>
      </RequireAuth>
    </AuthProvider>
  );
}
