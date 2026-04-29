import { UserView } from "@/features/users/components/user-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/users/$userId")({
  component: UserViewWrapper,
});

function UserViewWrapper() {
  const { userId } = Route.useParams();
  return <UserView userId={userId} />;
}
