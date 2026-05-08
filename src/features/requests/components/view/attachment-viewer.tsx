import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttachmentViewerProps {
  selectedAttachment: string | null;
  attachmentType: "image" | "pdf" | null;
  onClose: () => void;
}

export function AttachmentViewer({
  selectedAttachment,
  attachmentType,
  onClose,
}: AttachmentViewerProps) {
  return (
    <Dialog
      open={!!selectedAttachment}
      onOpenChange={(open) => !open && onClose()}
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
  );
}
