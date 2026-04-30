import MainLayout from "@/components/layout/mainLayout";
import { ActivityLogsPage } from "@/features/activity-logs";
import { AuthProvider, RequireAuth } from "@/features/auth/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const logSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/history/")({
  component: HistoryLayout,
  validateSearch: (search) => logSearchSchema.parse(search),
});

function HistoryLayout() {
  return (
    <AuthProvider>
      <RequireAuth>
        <MainLayout>
          <ActivityLogsPage />
        </MainLayout>
      </RequireAuth>
    </AuthProvider>
  );
}
