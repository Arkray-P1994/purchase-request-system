export interface UserRef {
  id?: number;
  name: string;
  role?: string;
}

export interface TeamRef {
  id?: number;
  name: string;
}

export interface StatusRef {
  id?: number;
  name: string;
}

export interface RequestItem {
  id?: number;
  item_title?: string;
  budget_code?: string;
  item_purpose?: string;
  quantity?: number;
  unit_price?: number;
  item_remarks?: string;
}

export interface RequestApproval {
  id?: number;
  level: number;
  status: string;
  comment?: string | null;
  created_at: string;
  approver?: UserRef;
}

export interface WorkflowStep {
  id?: number;
  approval_level: number;
  user?: UserRef;
  deleted_at?: string;
}

export interface Attachment {
  id?: number;
  file_name: string;
  file_path: string;
  user?: UserRef;
  created_at?: string;
}

export interface PurchaseRequest {
  id: number;
  ticket_id: string;
  status_id?: StatusRef | null;
  user_id?: UserRef | null;
  team_id?: TeamRef | null;
  transaction_type?: string;
  payment_method?: string;
  purchase_type?: string;
  currency?: string;
  vendor?: string;
  payee?: string;
  cost_center?: string;
  charge_to?: string;
  management_number?: string;
  items?: RequestItem[];
  remarks?: string;
  desired_delivery_date?: string | null;
  created_at?: string;
  released_at?: string | null;
  releasor?: UserRef | null;
  current_level?: number;
  workflow?: WorkflowStep[] | Record<string, WorkflowStep>;
  request_approvals?: RequestApproval[];
  attachments?: Attachment[];
}
