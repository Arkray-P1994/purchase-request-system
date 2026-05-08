import { useRef, useMemo } from "react";
import { toast } from "sonner";
import { Paperclip, Upload, Loader2, User, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { baseUrl } from "@/lib/base-url";
import { useStoreAttachment } from "../../actions/store-attachment";
import { PurchaseRequest, Attachment } from "@/types/request";

interface AttachmentsProps {
  request: PurchaseRequest;
  setSelectedAttachment: (url: string | null) => void;
  setAttachmentType: (type: "image" | "pdf" | null) => void;
  forceDownload: (url: string, filename: string) => Promise<void>;
}

export function Attachments({
  request,
  setSelectedAttachment,
  setAttachmentType,
  forceDownload,
}: AttachmentsProps) {
  const { trigger: uploadAttachments, isMutating: isUploading } = useStoreAttachment(String(request.id));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("attachments[]", file);
    });

    toast.promise(uploadAttachments(formData), {
      loading: "Uploading attachments...",
      success: "Attachments uploaded successfully!",
      error: "Failed to upload attachments. Please try again.",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const groupedAttachments = useMemo(() => {
    return request.attachments?.reduce((acc: Record<string, Attachment[]>, file: Attachment) => {
      const userName = file.user?.name || request.user_id?.name || "Unknown User";
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(file);
      return acc;
    }, {}) || {};
  }, [request.attachments, request.user_id?.name]);

  return (
    <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-primary" />
            Attachments
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none"
            >
              {request.attachments?.length || 0} Files
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px] uppercase tracking-wider font-bold"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Upload className="w-3 h-3 mr-1" />
              )}
              Upload
            </Button>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {Object.keys(groupedAttachments).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedAttachments).map(([userName, files]) => (
              <div key={userName} className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  {userName}
                </h4>
                <div className="space-y-3">
                  {files.map((file, index) => {
                    const cleanPath = file.file_path?.replace(/^[\/\\]+/, "");
                    const fileUrl = `${baseUrl.replace(/\/+$/, "")}/${cleanPath}`;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.file_name);
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
                            <span className="text-xs font-bold truncate pr-2">{file.file_name}</span>
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
                                setAttachmentType(isImage ? "image" : "pdf");
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
                            onClick={() => forceDownload(fileUrl, file.file_name)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-xl border-muted">
            <Paperclip className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">No attachments provided.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
