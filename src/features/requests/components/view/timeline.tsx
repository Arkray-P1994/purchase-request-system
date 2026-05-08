import moment from "moment";
import { Clock, Calendar, CheckCircle2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PurchaseRequest } from "@/types/request";

interface TimelineProps {
  request: PurchaseRequest;
}

export function Timeline({ request }: TimelineProps) {
  return (
    <Card className="border-none shadow-md bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase opacity-60">Desired Delivery</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 opacity-80" />
            <span className="text-lg font-black tracking-tight">
              {request.desired_delivery_date
                ? moment(request.desired_delivery_date).format("MMMM DD, YYYY")
                : "Not specified"}
            </span>
          </div>
        </div>
        <div className="h-px bg-primary-foreground/20" />
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase opacity-60">Created At</p>
            <p className="text-sm font-bold">{moment(request.created_at).format("LL")}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 opacity-20" />
        </div>
        {request.status_id?.name === "Released" && request.released_at && (
          <>
            <div className="h-px bg-primary-foreground/20" />
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase opacity-60">Released At</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 opacity-80" />
                  <span className="text-sm font-bold tracking-tight">
                    {moment(request.released_at).format("MMMM DD, YYYY · h:mm A")}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase opacity-60">Released By</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 opacity-80" />
                  <span className="text-sm font-bold tracking-tight">
                    {request.releasor?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
