import { useState } from "react";
import { useRequest } from "@/api/fetch-request";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { baseUrl } from "@/lib/base-url";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Package,
  User,
  MapPin,
  Hash,
  Building2,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import moment from "moment";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { ApprovalActions } from "./approval-actions";
import { StatusBadge } from "./status-badge";
import Spinner from "@/components/ui/spinner";
import { useDeleteRequest } from "../actions/delete-request";
import { useCancelRequest } from "../actions/cancel-request";
import { useUser } from "@/api/fetch-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Ban } from "lucide-react";

async function forceDownload(url: string, filename: string) {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

export function ViewRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams({ strict: false }) as any;
  const { user } = useUser();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null,
  );
  const [attachmentType, setAttachmentType] = useState<"image" | "pdf" | null>(
    null,
  );
  const { data: request, isLoading } = useRequest({ id: requestId });
  const { trigger: deleteReq, isMutating: isDeleting } = useDeleteRequest(
    String(requestId),
  );
  const { trigger: cancelReq, isMutating: isCancelling } = useCancelRequest(
    String(requestId),
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Request Not Found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const totalAmount =
    request.items?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-background/50">
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="max-w-8xl mx-auto space-y-8 pb-12">
          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/purchase-request/requests" })}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Requests
            </Button>
            <div className="flex items-center gap-2">
              {request && <ApprovalActions request={request} />}
              {request && (user?.user?.role?.toLowerCase() === "admin" 
                ? !["For Cash Release", "Released", "Approved", "Disapproved", "Rejected"].includes(request.status_id?.name || "")
                : ["Pending", "Draft"].includes(request.status_id?.name || "")) && (
                <>
                  <Link
                    to="/purchase-request/requests/$requestId/edit"
                    params={{ requestId: String(requestId) }}
                  >
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Request
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-500 hover:bg-orange-50 hover:text-orange-600 border-orange-200"
                    onClick={() => setOpenCancel(true)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel Request
                  </Button>

                  {user?.user?.role?.toLowerCase() === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setOpenDelete(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Request
                    </Button>
                  )}

                  <Dialog open={openCancel} onOpenChange={setOpenCancel}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <div className="bg-orange-100 w-fit p-2 rounded-full mb-2">
                          <Ban className="h-6 w-6 text-orange-600" />
                        </div>
                        <DialogTitle>Confirm Cancellation</DialogTitle>
                        <DialogDescription className="text-sm">
                          Are you sure you want to cancel request{" "}
                          <span className="font-bold text-foreground">
                            #{request.ticket_id}
                          </span>
                          ? This will stop the approval process and notify involved parties.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setOpenCancel(false)}
                          disabled={isCancelling}
                        >
                          No, keep it
                        </Button>
                        <Button
                          variant="default"
                          className="bg-orange-600 hover:bg-orange-700 text-white border-none"
                          onClick={async () => {
                            await cancelReq({ causer_id: user?.user?.id });
                            setOpenCancel(false);
                          }}
                          disabled={isCancelling}
                        >
                          {isCancelling ? "Cancelling..." : "Yes, Cancel Request"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <div className="bg-destructive/10 w-fit p-2 rounded-full mb-2">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-sm">
                          Are you sure you want to delete request{" "}
                          <span className="font-bold text-foreground">
                            #{request.ticket_id}
                          </span>
                          ? This action is permanent and will soft-delete all
                          associated items and attachments.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setOpenDelete(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            await deleteReq({ causer_id: user?.user?.id });
                            setOpenDelete(false);
                            navigate({ to: "/purchase-request/requests" });
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete Permanently"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                  <Hash className="h-3 w-3" />
                  {request.ticket_id}
                </span>
                <StatusBadge status={request.status_id?.name || "Pending"} />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Purchase Request
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {request.user_id?.name}
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {request.team_id?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
                Total Amount
              </span>
              <span className="text-4xl font-black text-primary">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(totalAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Procurement Details */}
              <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Procurement Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <DetailItem
                      label="Transaction Type"
                      value={request.transaction_type}
                      icon={<CreditCard className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Payment Method"
                      value={request.payment_method}
                      icon={<CreditCard className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Purchase Type"
                      value={request.purchase_type}
                      icon={<FileText className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Currency"
                      value={request.currency}
                      icon={<CreditCard className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Vendor"
                      value={request.vendor}
                      icon={<Building2 className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Payee / Recipient"
                      value={request.payee}
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Accounting Reference */}
              <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Accounting Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <DetailItem
                      label="Cost Center"
                      value={request.cost_center}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Charge To"
                      value={request.charge_to}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <DetailItem
                      label="Management No."
                      value={request.management_number}
                      icon={<Hash className="h-4 w-4" />}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Line Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50 border-b-2">
                      <TableRow>
                        <TableHead className="w-[50px] text-center font-bold text-[10px] uppercase border-r">
                          #
                        </TableHead>
                        <TableHead className="font-bold text-[10px] uppercase min-w-[120px] border-r">
                          Title
                        </TableHead>
                        <TableHead className="font-bold text-[10px] uppercase border-r">
                          Budget Code
                        </TableHead>
                        <TableHead className="font-bold text-[10px] uppercase min-w-[120px] border-r">
                          Purpose
                        </TableHead>
                        <TableHead className="w-[60px] text-center font-bold text-[10px] uppercase border-r">
                          Qty
                        </TableHead>
                        <TableHead className="w-[100px] text-right font-bold text-[10px] uppercase border-r">
                          Unit Price
                        </TableHead>
                        <TableHead className="w-[110px] text-right font-bold text-[10px] uppercase border-r">
                          Total
                        </TableHead>
                        <TableHead className="font-bold text-[10px] uppercase min-w-[120px]">
                          Remarks
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {request.items?.map((item: any, index: number) => (
                        <TableRow
                          key={item.id || index}
                          className="group hover:bg-muted/30 transition-colors border-b"
                        >
                          <TableCell className="text-center text-muted-foreground font-medium border-r">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border-r">
                            <p className="font-bold text-sm leading-none text-foreground">
                              {item.item_title}
                            </p>
                          </TableCell>
                          <TableCell className="border-r">
                            <code className="text-[10px] font-mono px-2 py-0.5 bg-primary/5 text-primary rounded-md border border-primary/10 font-bold">
                              {item.budget_code || "N/A"}
                            </code>
                          </TableCell>
                          <TableCell className="border-r">
                            <span
                              className="text-xs font-medium text-muted-foreground line-clamp-2"
                              title={item.item_purpose}
                            >
                              {item.item_purpose || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-bold text-sm border-r">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm border-r">
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: request.currency || "PHP",
                              minimumFractionDigits: 2,
                            }).format(item.unit_price)}
                          </TableCell>
                          <TableCell className="text-right font-black text-sm text-primary border-r">
                            {new Intl.NumberFormat("en-PH", {
                              style: "currency",
                              currency: request.currency || "PHP",
                              minimumFractionDigits: 2,
                            }).format(item.quantity * item.unit_price)}
                          </TableCell>
                          <TableCell>
                            <span
                              className="text-xs italic text-muted-foreground/80 line-clamp-2"
                              title={item.item_remarks}
                            >
                              {item.item_remarks || "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Remarks */}
              {request.remarks && (
                <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Requester Remarks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic leading-relaxed bg-muted/30 p-4 rounded-xl border border-muted/50">
                      "{request.remarks}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              <Card className="border-none shadow-md bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase opacity-60">
                      Desired Delivery
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 opacity-80" />
                      <span className="text-lg font-black tracking-tight">
                        {request.desired_delivery_date
                          ? moment(request.desired_delivery_date).format(
                              "MMMM DD, YYYY",
                            )
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-primary-foreground/20" />
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase opacity-60">
                        Created At
                      </p>
                      <p className="text-sm font-bold">
                        {moment(request.created_at).format("LL")}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 opacity-20" />
                  </div>
                  {request.status_id?.name === "Released" &&
                    request.released_at && (
                      <>
                        <div className="h-px bg-primary-foreground/20" />
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase opacity-60">
                              Released At
                            </p>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 opacity-80" />
                              <span className="text-sm font-bold tracking-tight">
                                {moment(request.released_at).format(
                                  "MMMM DD, YYYY · h:mm A",
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase opacity-60">
                              Released By
                            </p>
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

              {/* Approval Workflow */}
              {request.status_id?.name !== "Draft" && (
                <Card className="border border-border/50 shadow-none bg-card flex flex-col">
                  <CardHeader className="pb-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {!(
                          request.status_id?.name === "Approved" ||
                          request.status_id?.name === "Rejected" ||
                          request.status_id?.name === "Disapproved"
                        )
                          ? "Approval Workflow"
                          : "Approval History"}
                      </CardTitle>
                      <span className="text-[10px] tracking-wider text-muted-foreground/60">
                        {!(
                          request.status_id?.name === "Approved" ||
                          request.status_id?.name === "Rejected" ||
                          request.status_id?.name === "Disapproved"
                        ) ? (
                          <>
                            {request.current_level}/
                            {
                              (Array.isArray(request.workflow)
                                ? request.workflow
                                : Object.values(request.workflow || {}).filter(
                                    (w: any) =>
                                      w &&
                                      typeof w === "object" &&
                                      "approval_level" in w &&
                                      !w.deleted_at,
                                  )
                              ).length
                            }
                          </>
                        ) : (
                          <>{request.request_approvals?.length || 0} Steps</>
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {!(
                      request.status_id?.name === "Approved" ||
                      request.status_id?.name === "Rejected" ||
                      request.status_id?.name === "Disapproved"
                    ) ? (
                      <div className="relative">
                        {(Array.isArray(request.workflow)
                          ? request.workflow
                          : Object.values(request.workflow || {}).filter(
                              (w: any) =>
                                w &&
                                typeof w === "object" &&
                                "approval_level" in w,
                            )
                        )
                          .filter((w: any) => !w.deleted_at)
                          .sort(
                            (a: any, b: any) =>
                              Number(a.approval_level) -
                              Number(b.approval_level),
                          )
                          .map((step: any, index: number, arr: any[]) => {
                            const approval = request.request_approvals?.find(
                              (a: any) => a.level === step.approval_level,
                            );
                            const isRejected =
                              approval?.status === "Rejected" ||
                              approval?.status === "Disapproved" ||
                              ((request.status_id?.name === "Rejected" ||
                                request.status_id?.name === "Disapproved") &&
                                step.approval_level === request.current_level);
                            const isPast =
                              (step.approval_level < request.current_level ||
                                !!approval) &&
                              !isRejected;
                            const isCurrent =
                              step.approval_level === request.current_level &&
                              !approval &&
                              !isRejected;
                            const isLast = index === arr.length - 1;

                            let dotClass = "bg-muted border-border/50";
                            let lineClass = "bg-border";
                            let label = "Upcoming";
                            let labelClass = "text-muted-foreground/50";
                            let nameClass = "text-muted-foreground";
                            let levelClass = "text-muted-foreground/40";

                            if (isRejected) {
                              dotClass =
                                "bg-destructive border-destructive ring-4 ring-destructive/10";
                              label = "Declined";
                              labelClass = "text-destructive font-bold";
                              nameClass = "text-destructive font-semibold";
                              levelClass = "text-destructive/60";
                            } else if (isPast) {
                              dotClass =
                                "bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/20";
                              lineClass = "bg-emerald-500/40";
                              label = "Approved";
                              labelClass =
                                "text-emerald-600 dark:text-emerald-400 font-bold";
                              nameClass = "text-foreground font-medium";
                              levelClass =
                                "text-emerald-600/50 dark:text-emerald-400/50";
                            } else if (isCurrent) {
                              dotClass =
                                "bg-orange-500 border-orange-500 ring-4 ring-orange-500/20 animate-pulse";
                              label = "Pending";
                              labelClass =
                                "text-orange-600 dark:text-orange-500 font-bold";
                              nameClass = "text-foreground font-semibold";
                              levelClass = "text-orange-500/60";
                            }

                            return (
                              <div
                                key={index}
                                className="relative flex gap-5 pb-7 last:pb-0 group"
                              >
                                <div className="relative flex flex-col items-center">
                                  <div
                                    className={`relative h-2.5 w-2.5 rounded-full border transition-all z-10 ${dotClass}`}
                                  />
                                  {!isLast && (
                                    <div
                                      className={`flex-1 w-px mt-1.5 ${lineClass}`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 -mt-0.5 min-w-0 pb-1">
                                  <div className="flex items-baseline justify-between gap-3">
                                    <p
                                      className={`text-sm truncate transition-colors ${nameClass}`}
                                    >
                                      {step.user?.name || "System"}
                                    </p>
                                    <span
                                      className={`text-[10px] tabular-nums font-bold tracking-wider shrink-0 ${levelClass}`}
                                    >
                                      L{step.approval_level}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-[10px] mt-0.5 uppercase tracking-[0.15em] ${labelClass}`}
                                  >
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
                                        {moment(approval.created_at).format(
                                          "MMM DD, YYYY · h:mm A",
                                        )}
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
                          ?.sort((a: any, b: any) => a.level - b.level)
                          .map((approval: any, index: number, arr: any[]) => {
                            const isLast = index === arr.length - 1;
                            const isRejected =
                              approval.status === "Rejected" ||
                              approval.status === "Disapproved";

                            let dotClass =
                              "bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/20";
                            let labelClass =
                              "text-emerald-600 dark:text-emerald-400 font-bold";
                            let label = "Approved";

                            if (isRejected) {
                              dotClass =
                                "bg-destructive border-destructive ring-4 ring-destructive/10";
                              labelClass = "text-destructive font-bold";
                              label = "Declined";
                            }

                            return (
                              <div
                                key={index}
                                className="relative flex gap-5 pb-7 last:pb-0 group"
                              >
                                <div className="relative flex flex-col items-center">
                                  <div
                                    className={`relative h-2.5 w-2.5 rounded-full border transition-all z-10 ${dotClass}`}
                                  />
                                  {!isLast && (
                                    <div className="flex-1 w-px mt-1.5 bg-emerald-500/20" />
                                  )}
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
                                  <p
                                    className={`text-[10px] mt-0.5 uppercase tracking-[0.15em] ${labelClass}`}
                                  >
                                    {label}
                                  </p>
                                  <div className="mt-3 space-y-1.5">
                                    {approval.comment && (
                                      <p className="text-[13px] leading-relaxed text-muted-foreground/90 border-l border-border/70 pl-3 line-clamp-3">
                                        {approval.comment}
                                      </p>
                                    )}
                                    <p className="text-[10px] tabular-nums text-muted-foreground/50 tracking-wide">
                                      {moment(approval.created_at).format(
                                        "MMM DD, YYYY · h:mm A",
                                      )}
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
              )}

              {/* Attachments */}
              <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-muted/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Paperclip className="h-5 w-5 text-primary" />
                      Attachments
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none"
                    >
                      {request.attachments?.length || 0} Files
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {request.attachments && request.attachments.length > 0 ? (
                    <div className="space-y-3">
                      {request.attachments.map((file: any, index: number) => {
                        const fileUrl = `${baseUrl}/${file.file_path?.replace(/^[\/\\]/, "")}`;
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                          file.file_name,
                        );
                        const isPdf = /\.pdf$/i.test(file.file_name);
                        const isViewable = isImage || isPdf;

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-muted shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold truncate pr-2">
                                  {file.file_name}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              {isViewable && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 text-xs bg-primary/10 hover:bg-primary/20 text-primary"
                                  onClick={() => {
                                    setSelectedAttachment(fileUrl);
                                    setAttachmentType(
                                      isImage ? "image" : "pdf",
                                    );
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() =>
                                  forceDownload(fileUrl, file.file_name)
                                }
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-xl border-muted">
                      <Paperclip className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-medium">
                        No attachments provided.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Attachment Viewer Modal */}
        <Dialog
          open={!!selectedAttachment}
          onOpenChange={(open) => !open && setSelectedAttachment(null)}
        >
          <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-background/95 backdrop-blur-md border-muted">
            <DialogHeader className="p-4 border-b bg-muted/10 shrink-0">
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Attachment Viewer
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto bg-black/5 flex items-center justify-center p-4">
              {attachmentType === "image" ? (
                <img
                  src={selectedAttachment || ""}
                  alt="Attachment"
                  className="max-w-full max-h-full object-contain shadow-md rounded-lg"
                />
              ) : attachmentType === "pdf" ? (
                <iframe
                  src={selectedAttachment || ""}
                  className="w-full h-full border-0 bg-white rounded-lg shadow-md"
                  title="PDF Viewer"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </Main>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 group">
      <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors h-fit">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-foreground drop-shadow-sm">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
