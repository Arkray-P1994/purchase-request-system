import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/features/auth/auth";
import { TeamApproverList } from "@/features/team-approvers/components/team-approver-list";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute(
  "/purchase-request/team-approvers/",
)({
  component: () => (
    <RequireAuth adminOnly={true}>
      <TeamApproversPage />
    </RequireAuth>
  ),
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
        <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
               <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Team Approvers</h2>
              <p className="text-muted-foreground text-sm">
                Manage approval levels and workflows for each team.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-disable py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <TeamApproverList />
        </div>
      </Main>
    </>
  );
}
