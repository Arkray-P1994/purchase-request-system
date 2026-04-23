// routes/auth/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

// const { user } = useUser();

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/purchase-request/dashboard" });
  },
});
