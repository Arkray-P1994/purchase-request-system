// import { AuthProvider, RequireAuth } from "@/components/auth/auth";
import MainLayout from "@/components/layout/mainLayout";
import { AuthProvider, RequireAuth } from "@/features/auth/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request")({
  component: RequestorLayout,
});

function RequestorLayout() {
  return (
    <AuthProvider>
      <RequireAuth>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </RequireAuth>
    </AuthProvider>
  );
}
