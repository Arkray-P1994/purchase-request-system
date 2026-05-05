import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, User, Calendar, GitPullRequest, Tag, Hash, MessageSquare, ShieldCheck } from "lucide-react";
import type { ApprovalLog } from "./columns";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface LogViewDrawerProps {
  log: ApprovalLog;
}

export function LogViewDrawer({ log }: LogViewDrawerProps) {
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved') return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20';
    if (s === 'disapproved') return 'bg-rose-500/15 text-rose-600 border-rose-500/20';
    if (s === 'pending') return 'bg-amber-500/15 text-amber-600 border-amber-500/20';
    return 'bg-slate-500/15 text-slate-600 border-slate-500/20';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg p-0 flex flex-col gap-0 border-l shadow-2xl">
        <div className="p-6 border-b bg-muted/20">
          <SheetHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-xl font-bold">Approval Detail</SheetTitle>
            </div>
            <SheetDescription>
              Detailed record of the approval action for Ticket {log.request_id?.ticket_id}.
            </SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/70">
                  <Tag className="h-4 w-4" /> Basic Information
                </h3>
                <Badge variant="outline" className={cn("px-2.5 py-0.5 font-bold uppercase tracking-wide text-[10px]", getStatusColor(log.status))}>
                  {log.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border bg-card/50 flex flex-col gap-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Log ID
                  </span>
                  <span className="text-sm font-mono font-medium">#{log.id}</span>
                </div>
                <div className="p-4 rounded-xl border bg-card/50 flex flex-col gap-1.5 shadow-sm border-primary/20 bg-primary/[0.02]">
                  <span className="text-[10px] font-bold text-primary/70 uppercase flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3" /> Ticket ID
                  </span>
                  <span className="text-sm font-mono font-bold text-primary">
                    {log.request_id?.ticket_id ? (
                      <Link 
                        to="/purchase-request/requests/$requestId" 
                        params={{ requestId: String(log.request_id.id) }}
                        className="hover:underline"
                      >
                        {log.request_id.ticket_id}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-card/50 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border shadow-inner">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Approver</span>
                    <span className="text-sm font-semibold">{log.approver_id?.name || "System"}</span>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border shadow-inner">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Decision Date</span>
                    <span className="text-sm font-semibold">{moment(log.created_at).format("LLLL")}</span>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="flex items-center gap-3">
                   <Badge variant="secondary" className="h-10 px-4 rounded-full font-bold flex items-center gap-2">
                     Approval Level {log.level}
                   </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4 pb-10">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/70">
                <MessageSquare className="h-4 w-4" /> Remarks / Feedback
              </h3>
              
              <div className="rounded-xl bg-muted/30 p-4 border border-border/50 shadow-inner italic text-sm text-foreground/80 min-h-24">
                {log.remarks || "No remarks provided for this decision."}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20 flex justify-end">
           <SheetTrigger asChild>
             <Button variant="outline" className="h-9 px-6 font-medium">Close</Button>
           </SheetTrigger>
        </div>
      </SheetContent>
    </Sheet>
  );
}
