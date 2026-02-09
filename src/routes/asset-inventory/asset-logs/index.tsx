import { AssetLogsPage } from "@/features/asset-logs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/asset-logs/")({
  component: AssetLogsPage,
});
