import { z } from "zod";

export const requestSchema = z.object({
  id: z.number(),
  ticket_id: z.string(),
  status_id: z.object({
    name: z.string(),
  }).optional().nullable(),
  user_id: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional().nullable(),
  team_id: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional().nullable(),
  items: z.array(z.object({
    id: z.number().optional(),
    item_title: z.string().optional(),
    quantity: z.coerce.number().optional(),
    unit_price: z.coerce.number().optional(),
    item_purpose: z.string().optional(),
    item_remarks: z.string().optional(),
    budget_code: z.string().optional(),
    budget_id: z.number().optional(),
    total_price: z.number().optional(),
  })).optional(),
  fy_start: z.string().optional(),
  fy_end: z.string().optional(),
  request_approvals: z.array(z.object({
    id: z.number().optional(),
    approver: z.object({
      name: z.string(),
    }).optional(),
    level: z.number(),
    status: z.string(),
    comment: z.string().optional().nullable(),
    created_at: z.string(),
  })).optional(),
  workflow: z.array(z.object({
    id: z.number().optional(),
    user: z.object({
      id: z.number().optional(),
      name: z.string(),
    }).optional(),
    approval_level: z.number(),
  })).optional(),
  remarks: z.string().optional(),
  current_level: z.number().optional(),
  current_approver: z.object({
    user: z.object({
      name: z.string(),
    }),
  }).optional().nullable(),
  desired_delivery_date: z.string().optional(),
  attachments: z.array(z.object({
    file_name: z.string(),
    file_path: z.string(),
  })).optional(),
  released_at: z.string().optional().nullable(),
  releasor: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional().nullable(),
});

export type Request = z.infer<typeof requestSchema>;

export const createRequestSchema = z.object({
  desired_delivery_date: z.date(),
  remarks: z.string().optional().nullable().default(""),
  transaction_type: z.string().min(1, "Transaction type is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  purchase_type: z.string().min(1, "Purchase type is required"),
  cost_center: z.string().min(1, "Cost center is required"),
  currency: z.string().min(1, "Currency is required"),
  vendor: z.string().min(1, "Vendor name is required"),
  payee: z.string().min(1, "Payee / Recipient is required"),
  charge_to: z.string().optional().nullable().default(""),
  management_number: z.string().optional().nullable().default(""),
  team_id: z.string().min(1, "Team is required"),
  attachments: z.array(z.instanceof(File)).optional().default([]),
  fy_start: z.date().optional(),
  fy_end: z.date().optional(),
  items: z.array(z.object({
    item_title: z.string().min(1, "Item title is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number().min(1, "Unit price is required"),
    item_purpose: z.string().min(1, "Purpose is required"),
    item_remarks: z.string().optional().nullable().default(""),
    budget_code: z.string().min(1, "Budget code is required"),
    budget_id: z.number().optional(),
  })).min(1, "At least one item is required"),
});

export interface BudgetSubEntry {
  id: number;
  account_code: string;
  item_name: string;
  remaining: string | number;
}

export interface BudgetEntry {
  unq_code: string | number;
  name: string;
  budget_entries: BudgetSubEntry[];
  fy_start?: string;
  fy_end?: string;
}

export const getCreateRequestSchema = (budgetEntries: BudgetEntry[]) =>
  createRequestSchema.superRefine((data, ctx) => {
    const selectedEntry = budgetEntries?.find(
      (b: BudgetEntry) =>
        `${b.unq_code} - ${b.name}` === data.cost_center ||
        `${b.name} - ${b.unq_code}` === data.cost_center,
    );

    const budgetCodeOptions =
      selectedEntry?.budget_entries?.map((item: BudgetSubEntry) => ({
        id: item.id,
        name: `${item.account_code} - ${item.item_name}`,
        balance: Number(item.remaining || 0),
      })) || [];

    const aggregateTotals: Record<string, number> = {};
    data.items.forEach((item) => {
      if (item.budget_code) {
        const itemTotal = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
        aggregateTotals[item.budget_code] = (aggregateTotals[item.budget_code] || 0) + itemTotal;
      }
    });

    data.items.forEach((item, index) => {
      const option = budgetCodeOptions.find((opt) => opt.name === item.budget_code);
      if (option) {
        const totalForThisBudget = aggregateTotals[item.budget_code];
        if (totalForThisBudget > option.balance) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Insufficient budget",
            path: ["items", index, "unit_price"],
          });
        }
      }
    });
  });

export type CreateRequestValues = z.infer<typeof createRequestSchema>;
