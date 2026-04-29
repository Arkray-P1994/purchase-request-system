import { createFileRoute } from "@tanstack/react-router";
import { TeamApproverList } from "@/features/team-approvers/components/team-approver-list";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";

export const Route = createFileRoute(
  "/purchase-request/team-approvers/",
)({
  component: TeamApproversPage,
});

function TeamApproversPage() {
  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Approvers</h1>
            <p className="text-muted-foreground">
              Manage approval levels and workflows for each team.
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-disable py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <TeamApproverList />
        </div>
      </Main>
    </>
  );
}
