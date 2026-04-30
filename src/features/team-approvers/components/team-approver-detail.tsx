import { useApprovers } from "@/api/fetch-approvers";
import { useTeams } from "@/api/fetch-teams";
import { ApproverFlow } from "./approver-flow";
import { ApproverSheet } from "./approver-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Info, Target, Save, Undo2, GripVertical } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { useReorderApprovers } from "../actions/mutate-approvers";
import { toast } from "sonner";

export function TeamApproverDetail({ teamId }: { teamId: string | number }) {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { approvers: initialApprovers, isLoading: approversLoading } = useApprovers({ team_id: teamId });
  const [localApprovers, setLocalApprovers] = React.useState<any[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const reorderMutation = useReorderApprovers();

  React.useEffect(() => {
    if (initialApprovers) {
      setLocalApprovers([...initialApprovers].sort((a, b) => a.approval_level - b.approval_level));
    }
  }, [initialApprovers]);

  const handleOrderChange = (newOrder: any[]) => {
    setLocalApprovers(newOrder);
    setIsDirty(true);
  };

  const handleDiscard = () => {
    if (initialApprovers) {
      setLocalApprovers([...initialApprovers].sort((a, b) => a.approval_level - b.approval_level));
      setIsDirty(false);
      toast.info("Changes discarded");
    }
  };

  const handleSave = async () => {
    try {
      toast.loading("Updating workflow order...", { id: "save-order" });
      
      const payload = {
        approvers: localApprovers.map((approver, index) => ({
          id: approver.id,
          approval_level: index + 1
        }))
      };

      await reorderMutation.trigger(payload);

      setIsDirty(false);
      toast.success("Workflow order updated successfully", { id: "save-order" });
    } catch (error: any) {
      console.error("Failed to save order:", error);
      toast.error(error.message || "Failed to save workflow order", { id: "save-order" });
    }
  };

  if (teamsLoading || approversLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-3xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  const team = teams.find((t: any) => t.id.toString() === teamId.toString());

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="p-4 bg-destructive/10 rounded-full mb-4">
          <Info className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Team Not Found</h2>
        <Button asChild variant="outline" className="mt-6 rounded-full px-6">
          <Link to="/purchase-request/team-approvers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <Button asChild variant="outline" size="icon" className="rounded-2xl h-12 w-12 shrink-0 shadow-sm hover:bg-primary/5 transition-colors">
              <Link to="/purchase-request/team-approvers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                  Team Workflow
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-foreground/90">{team.name}</h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-md font-medium">
                Designing the multi-level approval pipeline. Drag to reorder.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {isDirty ? (
               <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="gap-2 rounded-xl h-10 px-4"
                   onClick={handleDiscard}
                 >
                   <Undo2 className="h-4 w-4" />
                   Discard
                 </Button>
                 <Button 
                   size="sm" 
                   className="gap-2 rounded-xl h-10 px-6 shadow-lg shadow-primary/20"
                   onClick={handleSave}
                   disabled={reorderMutation.isMutating}
                 >
                   <Save className="h-4 w-4" />
                   {reorderMutation.isMutating ? "Saving..." : "Save Order"}
                 </Button>
               </div>
             ) : (
               <div className="flex items-center gap-3">
                 <div className="hidden sm:flex items-center gap-8 mr-6 border-r border-muted/20 pr-8">
                   <div className="text-center">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Levels</p>
                     <p className="text-xl font-black text-primary">{localApprovers.length}</p>
                   </div>
                 </div>
                 <ApproverSheet defaultTeamId={teamId} nextLevel={localApprovers.length + 1} />
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-2xl rounded-3xl overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="border-b border-muted/20 px-8 py-6 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Sequence Chart</CardTitle>
                    <CardDescription className="text-xs font-medium">Drag the handle to reorder the sequence</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 md:p-12 min-h-[500px]">
              <div className="relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                
                <div className="relative">
                  <ApproverFlow 
                    approvers={localApprovers} 
                    onOrderChange={handleOrderChange}
                    isReordering={isDirty}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Logic & Rules</span>
              </div>
              <CardTitle className="text-lg">Workflow Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">Interactive Reordering</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use the drag handle on the left of each card to change the approval sequence.
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-muted/30" />

                <div className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Save className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">Drafting Changes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Changes are kept in draft until you click "Save Order". You can discard at any time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Pro Tip</span>
                </div>
                <p className="text-xs font-medium text-foreground/80 leading-relaxed italic">
                  "Dragging level 3 to level 1 will automatically shift everyone else down. Ensure your hierarchy is correct before saving."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
