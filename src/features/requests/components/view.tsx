import { useState, useMemo } from "react";
import { useRequest } from "@/api/fetch-request";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "@tanstack/react-router";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/api/fetch-user";
import { forceDownload } from "@/lib/utils";
import { PurchaseRequest } from "@/types/request";

import { Attachments } from "./view/attachments";
import { LineItems } from "./view/line-items";
import { ApprovalWorkflow } from "./view/approval-workflow";
import { Timeline } from "./view/timeline";
import { ProcurementDetails, AccountingReference } from "./view/request-info-cards";
import { ActionButtons } from "./view/action-buttons";
import { RequestHeaderInfo } from "./view/request-header-info";
import { AttachmentViewer } from "./view/attachment-viewer";

export function ViewRequest() {
  const navigate = useNavigate();
  const { requestId } = useParams({ strict: false }) as any;
  const { user } = useUser();
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<"image" | "pdf" | null>(null);
  
  const { data, isLoading } = useRequest({ id: requestId });
  const request = data as PurchaseRequest | undefined;

  const totalAmount = useMemo(() => 
    request?.items?.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
      0,
    ) || 0,
  [request?.items]);

  if (isLoading) return <Spinner />;

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Request Not Found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="max-w-full mx-auto space-y-8 pb-12">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/purchase-request/requests" })}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Requests
            </Button>
            <ActionButtons request={request} user={user} />
          </div>

          <RequestHeaderInfo request={request} totalAmount={totalAmount} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProcurementDetails request={request} />
              <AccountingReference request={request} />
              <LineItems items={request.items || []} currency={request.currency} />

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

            <div className="space-y-6">
              <Timeline request={request} />
              {request.status_id?.name !== "Draft" && <ApprovalWorkflow request={request} />}
              <Attachments
                request={request}
                setSelectedAttachment={setSelectedAttachment}
                setAttachmentType={setAttachmentType}
                forceDownload={forceDownload}
              />
            </div>
          </div>
        </div>

        <AttachmentViewer
          selectedAttachment={selectedAttachment}
          attachmentType={attachmentType}
          onClose={() => setSelectedAttachment(null)}
        />
      </Main>
    </div>
  );
}
