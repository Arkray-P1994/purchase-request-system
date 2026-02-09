import { useAssets } from "@/api/fetch-assets";
import { AssetTagDocument } from "@/components/pdf";
import { PDFViewer } from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { memo, useEffect, useState } from "react";
import { useIdStore } from "../store";

// Memoize the PDF Document to prevent unnecessary layout recalculations
const MemoizedAssetTagDocument = memo(({ assets }: { assets: any[] }) => (
  <AssetTagDocument assets={assets} />
));

export function PrintView() {
  const { ids } = useIdStore();
  const { data, isLoading: isFetching } = useAssets({
    id: String(ids),
    limit: "9999",
    sort: "location:asc",
  });
  const [assetsWithQR, setAssetsWithQR] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const isProcessing = isFetching || isGenerating;

  // 2. QR Generation Logic
  useEffect(() => {
    const generateQRs = async () => {
      if (isFetching || !data?.data || data.data.length === 0) {
        setAssetsWithQR([]);
        return;
      }

      setIsGenerating(true);
      try {
        const processed = await Promise.all(
          data.data.map(async (item: any) => {
            try {
              const qrContent =
                item.asset_id?.toString() || item.id?.toString() || "";
              const qrCode = await QRCode.toDataURL(qrContent, {
                margin: 0,
                width: 200,
                errorCorrectionLevel: "M",
              });
              return { ...item, qrCode };
            } catch (err) {
              return item;
            }
          }),
        );
        setAssetsWithQR(processed);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRs();
  }, [data?.data, isFetching]);

  return (
    <div className="mt-6">
      <div className="w-full h-[calc(100vh-250px)] border rounded-lg overflow-hidden bg-zinc-900">
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : assetsWithQR.length > 0 ? (
          <PDFViewer
            width="100%"
            height="100%"
            showToolbar
            className="border-none"
          >
            <MemoizedAssetTagDocument assets={assetsWithQR} />
          </PDFViewer>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No assets found.
          </div>
        )}
      </div>
    </div>
  );
}
