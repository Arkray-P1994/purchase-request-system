import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Under Approval": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "For Cash Release": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Released: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    Draft: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
    Disapproved: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge
      className={`px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] border ${
        variants[status] || "bg-muted text-muted-foreground border-transparent"
      } shadow-none`}
    >
      {status}
    </Badge>
  );
}
