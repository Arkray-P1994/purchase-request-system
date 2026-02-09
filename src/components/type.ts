// routes/asset-inventory/assets/print.tsx (or wherever your route is defined)
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Define the schema for your search params
const assetSearchSchema = z.object({
  filter: z.string().optional(),
  remarks: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/asset-inventory/assets/print/")({
  validateSearch: (search) => assetSearchSchema.parse(search),
});
