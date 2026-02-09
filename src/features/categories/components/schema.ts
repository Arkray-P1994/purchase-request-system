import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const vendorSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  email: z.string(),
  products: z.string(),
});

export type Vendor = z.infer<typeof vendorSchema>;
