import moment from "moment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PurchaseRequest, WorkflowStep, RequestApproval } from "@/types/request";

interface ApprovalWorkflowProps {
  request: PurchaseRequest;
}

export function ApprovalWorkflow({ request }: ApprovalWorkflowProps) {
  const isFinalized = ["Approved", "Rejected", "Disapproved", "Cancelled"].includes(
    request.status_id?.name || "",
  );

  const workflow = (
    Array.isArray(request.workflow)
      ? request.workflow
      : Object.values(request.workflow || {}).filter(
          (w: any) => w && typeof w === "object" && "approval_level" in w && !w.deleted_at,
        )
  ) as WorkflowStep[];

  return (
    <Card className="border border-border/50 shadow-none bg-card flex flex-col">
      <CardHeader className="pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {!isFinalized ? "Approval Workflow" : "Approval History"}
          </CardTitle>
          <span className="text-[10px] tracking-wider text-muted-foreground/60">
            {!isFinalized ? (
              <>
                {request.current_level || 0}/{workflow.length}
              </>
            ) : (
              <>{request.request_approvals?.length || 0} Steps</>
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {!isFinalized ? (
          <div className="relative">
            {workflow
              .sort((a, b) => Number(a.approval_level) - Number(b.approval_level))
              .map((step, index, arr) => {
                const approval = request.request_approvals?.find(
                  (a: RequestApproval) => a.level === step.approval_level,
                );
                const isRejected =
                  approval?.status === "Rejected" ||
                  approval?.status === "Disapproved" ||
                  ((request.status_id?.name === "Rejected" ||
                    request.status_id?.name === "Disapproved") &&
                    step.approval_level === (request.current_level || 0));
                const isPast = (step.approval_level < (request.current_level || 0) || !!approval) && !isRejected;
                const isCurrent =
                  step.approval_level === (request.current_level || 0) && !approval && !isRejected;
                const isLast = index === arr.length - 1;

                let dotClass = "bg-muted border-border/50";
                let lineClass = "bg-border";
                let label = "Upcoming";
                let labelClass = "text-muted-foreground/50";
                let nameClass = "text-muted-foreground";
                let levelClass = "text-muted-foreground/40";

                if (isRejected) {
                  dotClass = "bg-destructive border-destructive ring-4 ring-destructive/10";
                  label = "Declined";
                  labelClass = "text-destructive font-bold";
                  nameClass = "text-destructive font-semibold";
                  levelClass = "text-destructive/60";
                } else if (isPast) {
                  dotClass = "bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/20";
                  lineClass = "bg-emerald-500/40";
                  label = "Approved";
                  labelClass = "text-emerald-600 dark:text-emerald-400 font-bold";
                  nameClass = "text-foreground font-medium";
                  levelClass = "text-emerald-600/50 dark:text-emerald-400/50";
                } else if (isCurrent) {
                  dotClass = "bg-orange-500 border-orange-500 ring-4 ring-orange-500/20 animate-pulse";
                  label = "Pending";
                  labelClass = "text-orange-600 dark:text-orange-500 font-bold";
                  nameClass = "text-foreground font-semibold";
                  levelClass = "text-orange-500/60";
                }

                return (
                  <div key={index} className="relative flex gap-5 pb-7 last:pb-0 group">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`relative h-2.5 w-2.5 rounded-full border transition-all z-10 ${dotClass}`}
                      />
                      {!isLast && <div className={`flex-1 w-px mt-1.5 ${lineClass}`} />}
                    </div>
                    <div className="flex-1 -mt-0.5 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className={`text-sm truncate transition-colors ${nameClass}`}>
                          {step.user?.name || "System"}
                        </p>
                        <span
                          className={`text-[10px] tabular-nums font-bold tracking-wider shrink-0 ${levelClass}`}
                        >
                          L{step.approval_level}
                        </span>
                      </div>
                      <p className={`text-[10px] mt-0.5 uppercase tracking-[0.15em] ${labelClass}`}>
                        {label}
                      </p>
                      {approval && (
                        <div className="mt-3 space-y-1.5">
                          {approval.comment && (
                            <p className="text-[13px] leading-relaxed text-muted-foreground/90 border-l border-border/70 pl-3 line-clamp-3">
                              {approval.comment}
                            </p>
                          )}
                          <p className="text-[10px] tabular-nums text-muted-foreground/50 tracking-wide">
                            {moment(approval.created_at).format("MMM DD, YYYY · h:mm A")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="relative">
            {request.request_approvals
              ?.sort((a, b) => a.level - b.level)
              .map((approval, index, arr) => {
                const isLast = index === arr.length - 1;
                const isRejected = approval.status === "Rejected" || approval.status === "Disapproved";

                let dotClass = "bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/20";
                let labelClass = "text-emerald-600 dark:text-emerald-400 font-bold";
                let label = "Approved";

                if (isRejected) {
                  dotClass = "bg-destructive border-destructive ring-4 ring-destructive/10";
                  labelClass = "text-destructive font-bold";
                  label = "Declined";
                }

                return (
                  <div key={index} className="relative flex gap-5 pb-7 last:pb-0 group">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`relative h-2.5 w-2.5 rounded-full border transition-all z-10 ${dotClass}`}
                      />
                      {!isLast && <div className="flex-1 w-px mt-1.5 bg-emerald-500/20" />}
                    </div>
                    <div className="flex-1 -mt-0.5 min-w-0 pb-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm truncate font-medium text-foreground">
                          {approval.approver?.name || "System"}
                        </p>
                        <span className="text-[10px] tabular-nums font-bold tracking-wider text-muted-foreground opacity-50">
                          L{approval.level}
                        </span>
                      </div>
                      <p className={`text-[10px] mt-0.5 uppercase tracking-[0.15em] ${labelClass}`}>
                        {label}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {approval.comment && (
                          <p className="text-[13px] leading-relaxed text-muted-foreground/90 border-l border-border/70 pl-3 line-clamp-3">
                            {approval.comment}
                          </p>
                        )}
                        <p className="text-[10px] tabular-nums text-muted-foreground/50 tracking-wide">
                          {moment(approval.created_at).format("MMM DD, YYYY · h:mm A")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
