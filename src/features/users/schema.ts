import { z } from "zod";

export const userSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.string(),
  team_names: z.string().nullable().optional(),
  team_ids: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  team_ids: z.array(z.string().or(z.number())).min(1, "At least one team is required"),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Role is required"),
  team_ids: z.array(z.string().or(z.number())).min(1, "At least one team is required"),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
