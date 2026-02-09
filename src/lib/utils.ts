import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

// new
export const categoriesFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Category Name is required" }),
});

export type CategoryFormValues = z.infer<typeof categoriesFormSchema>;

export const assetFormSchema = z.object({
  id: z.number().optional(),
  asset_id: z.string().min(1, { message: "Asset ID required" }),
  asset_name: z.string().min(1, { message: "Asset Name is required" }),
  location: z.string().optional(),
  date: z.date(),
  model: z.string().optional(),
  serial: z.string().optional(),
  remarks: z.string().optional(),
  user_id: z.number().optional(),
  status: z.number().min(1, { message: "Status is required" }),
  team_id: z.number().min(1, { message: "Team is required" }),
  currency_id: z.number().min(1, { message: "Currency is required" }),
  category_id: z.number().min(1, { message: "Category is required" }),
  purchase_price: z.number().min(1, { message: "Purchase price is required" }),
  depreciated_value: z.number().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const userFormSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, { message: "Asset ID required" }),
  name: z.string().min(1, { message: "Asset Name is required" }),
  position: z.string().min(1, { message: "Asset Name is required" }),
  team_id: z.number().min(1, { message: "Team is required" }),
  password: z.string().min(1, { message: "Team is required" }),
});

export type userFormValues = z.infer<typeof userFormSchema>;

export const updateuserFormSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(1, { message: "Asset ID required" }),
  name: z.string().min(1, { message: "Asset Name is required" }),
  position: z.string().min(1, { message: "Asset Name is required" }),
  team_id: z.number().min(1, { message: "Team is required" }),
});

export type UpdateUserFormValues = z.infer<typeof updateuserFormSchema>;

export function formatDateForSubmission(date: Date): string {
  const manilaOffsetMs = 8 * 60 * 60 * 1000; // UTC+8
  const manilaTime = new Date(date.getTime() + manilaOffsetMs);

  const year = manilaTime.getUTCFullYear();
  const month = String(manilaTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(manilaTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5; // Maximum number of page buttons to show
  const rangeWithDots = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    // Always show first page
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push("...", totalPages);
    }
  }

  return rangeWithDots;
}
