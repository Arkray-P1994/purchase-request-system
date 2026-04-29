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
  remarks: z.string().default(""),
  transaction_type: z.string().default(""),
  payment_method: z.string().default(""),
  purchase_type: z.string().default(""),
  cost_center: z.string().min(1, "Cost center is required"),
  currency: z.string().default("PHP"),
  vendor: z.string().min(1, "Vendor name is required"),
  payee: z.string().min(1, "Payee / Recipient is required"),
  charge_to: z.string().default(""),
  management_number: z.string().default(""),
  team_id: z.string().min(1, "Team is required"),
  attachments: z.array(z.any()).optional().default([]),
  fy_start: z.date().optional(),
  fy_end: z.date().optional(),
  items: z.array(z.object({
    item_title: z.string().min(1, "Item title is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number().min(1, "Unit price is required"),
    item_purpose: z.string().min(1, "Purpose is required"),
    item_remarks: z.string().default(""),
    budget_code: z.string().min(1, "Budget code is required"),
    budget_id: z.number().optional(),
  })).min(1, "At least one item is required"),
});

export interface CreateRequestValues {
  desired_delivery_date: Date;
  remarks: string;
  transaction_type: string;
  payment_method: string;
  purchase_type: string;
  cost_center: string;
  currency: string;
  vendor: string;
  payee: string;
  charge_to: string;
  management_number: string;
  team_id: string;
  attachments: File[];
  fy_start?: Date;
  fy_end?: Date;
  items: {
    item_title: string;
    quantity: number;
    unit_price: number;
    item_purpose: string;
    item_remarks: string;
    budget_code: string;
    budget_id?: number;
  }[];
}
