import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Team {
  id: number;
  name: string;
}

export function TeamCard({ team, approverCount }: { team: Team; approverCount: number }) {
  return (
    <Link 
      to="/purchase-request/team-approvers/$teamId" 
      params={{ teamId: team.id.toString() }}
      className="block group"
    >
      <Card className="h-full flex flex-col border-none shadow-lg bg-card/40 backdrop-blur-md overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-t-4 border-t-transparent hover:border-t-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Users2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Managed approval levels for this team.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
              {approverCount} {approverCount === 1 ? 'Approver' : 'Approvers'}
            </div>
          </div>
          <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Workflow <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
