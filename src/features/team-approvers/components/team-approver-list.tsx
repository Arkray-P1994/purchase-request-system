import { useTeams } from "@/api/fetch-teams";
import { useApprovers } from "@/api/fetch-approvers";
import { TeamCard } from "./team-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Info, Search, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export function TeamApproverList() {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { approvers, isLoading: approversLoading } = useApprovers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return [...teams]
      .filter((team: any) => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [teams, searchQuery]);

  if (teamsLoading || approversLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <Alert className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Approval Workflow System</AlertTitle>
        <AlertDescription className="text-muted-foreground text-sm">
          Configure the sequential approval steps for each team. Requests will follow the levels defined below from Level 1 upwards.
        </AlertDescription>
      </Alert>

      <div className="max-w-md mx-auto relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-1 h-auto p-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {filteredTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
          <ShieldCheck className="h-12 w-12 mb-4 opacity-10" />
          <p className="text-lg font-medium">No teams found matching "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTeams.map((team: any) => {
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
      )}
    </div>
  );
}
