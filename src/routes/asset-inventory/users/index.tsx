import { RequireAuth } from "@/features/auth/auth";
import { UsersPage } from "@/features/users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth superAdminOnly>
      <UsersPage />
    </RequireAuth>
  );
}
