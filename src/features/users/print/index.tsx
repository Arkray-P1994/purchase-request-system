import { useState, useEffect, useMemo, memo } from "react";
import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";
import { PDFViewer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useSearchParams } from "@/api/print-search-params";
import { QueryMultiSelect } from "@/components/multi-select";
import { AssetTagDocument } from "@/components/pdf";
import { FileText, Loader2 } from "lucide-react";
import { useQueryStates, parseAsArrayOf, parseAsString } from "nuqs";

// Memoize the PDF Document to prevent unnecessary layout recalculations
const MemoizedAssetTagDocument = memo(({ assets }: { assets: any[] }) => (
  <AssetTagDocument assets={assets} />
));
const queryConfig = {
  location: parseAsArrayOf(parseAsString).withDefault([]),
  remarks: parseAsArrayOf(parseAsString).withDefault([]),
};
export function AssetPrintPage() {
  const [query, setQuery] = useQueryStates(queryConfig);

  const search = useSearch({ from: "/asset-inventory/assets/print/" });

  // 1. Data Fetching
  const { data, isLoading: isFetching } = useSearchParams(search);

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
          })
        );
        setAssetsWithQR(processed);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRs();
  }, [data?.data, isFetching]);

  // 3. Memoized Options
  const remarkOptions = useMemo(
    () =>
      data?.uniques?.remarks?.map((r: string) => ({ label: r, value: r })) ||
      [],
    [data?.uniques?.remarks]
  );

  const locationOptions = useMemo(
    () =>
      data?.uniques?.location?.map((l: string) => ({ label: l, value: l })) ||
      [],
    [data?.uniques?.location]
  );

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-2">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>

      <Main>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Print Layout (A4)
          </h2>
          <p className="text-muted-foreground">
            {isProcessing
              ? "Processing..."
              : `${assetsWithQR.length} assets ready.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {remarkOptions.length > 0 && (
            <QueryMultiSelect
              title="Remarks"
              queryKey="remarks"
              options={remarkOptions}
              query={query}
              setQuery={setQuery}
            />
          )}

          {locationOptions.length > 0 && (
            <QueryMultiSelect
              title="Location"
              queryKey="location"
              options={locationOptions}
              query={query}
              setQuery={setQuery}
            />
          )}
        </div>

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
      </Main>
    </>
  );
}
