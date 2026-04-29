import { useTeams } from "@/api/fetch-teams";
import { useApprovers } from "@/api/fetch-approvers";
import { TeamCard } from "./team-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function TeamApproverList() {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { approvers, isLoading: approversLoading } = useApprovers();

  if (teamsLoading || approversLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <ShieldCheck className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">No teams found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <Alert className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Approval Workflow System</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Configure the sequential approval steps for each team. Requests will follow the levels defined below from Level 1 upwards.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...teams]
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((team: any) => {
            const teamApprovers = approvers.filter((a: any) => {
            const aTeamId = typeof a.team_id === "object" ? a.team_id?.id : a.team_id;
            return Number(aTeamId) === Number(team.id);
          });
          return (
            <TeamCard 
              key={team.id} 
              team={team} 
              approverCount={teamApprovers.length} 
            />
          );
        })}
      </div>
    </div>
  );
}
