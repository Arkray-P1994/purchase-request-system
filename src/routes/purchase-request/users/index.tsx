import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/features/users";

export const Route = createFileRoute("/purchase-request/users/")({
  component: UsersPage,
});
