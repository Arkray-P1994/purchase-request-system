import { CategoriesPage } from "@/features/categories";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/categories/")({
  component: CategoriesPage,
});
