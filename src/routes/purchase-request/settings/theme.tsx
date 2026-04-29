import { ThemeSettings } from "@/features/settings/theme-settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase-request/settings/theme")({
  component: ThemeSettings,
});
