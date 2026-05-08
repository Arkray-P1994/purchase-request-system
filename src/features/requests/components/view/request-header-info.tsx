import { Hash, User, Building2 } from "lucide-react";
import { StatusBadge } from "../status-badge";
import { formatCurrency } from "@/lib/utils";
import { PurchaseRequest } from "@/types/request";

interface RequestHeaderInfoProps {
  request: PurchaseRequest;
  totalAmount: number;
}

export function RequestHeaderInfo({ request, totalAmount }: RequestHeaderInfoProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
            <Hash className="h-3 w-3" />
            {request.ticket_id}
          </span>
          <StatusBadge status={request.status_id?.name || "Pending"} bounce />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Purchase Request
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{request.user_id?.name}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{request.team_id?.name}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 text-right">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
          Total Amount
        </span>
        <span className="text-4xl font-black text-primary">
          {formatCurrency(totalAmount, request.currency)}
        </span>
      </div>
    </div>
  );
}
