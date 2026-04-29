import { createFileRoute } from "@tanstack/react-router";
import { TeamApproverDetail } from "@/features/team-approvers/components/team-approver-detail";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";

export const Route = createFileRoute(
  "/purchase-request/team-approvers/$teamId",
)({
  component: TeamApproverDetailPage,
});

function TeamApproverDetailPage() {
  const { teamId } = Route.useParams();
  
  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main className="p-0 sm:p-0 overflow-hidden">
        <TeamApproverDetail teamId={teamId} />
      </Main>
    </>
  );
}
