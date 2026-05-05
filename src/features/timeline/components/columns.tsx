import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LogViewDrawer } from "./log-view-drawer";
import { Link } from "@tanstack/react-router";

export type ApprovalLog = {
  id: number;
  request_id?: {
    id: number;
    ticket_id: string;
  };
  approver_id?: {
    name: string;
  };
  level: number;
  status: string;
  remarks?: string;
  created_at: string;
};

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'approved') return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20';
  if (s === 'disapproved') return 'bg-rose-500/15 text-rose-600 border-rose-500/20';
  if (s === 'pending') return 'bg-amber-500/15 text-amber-600 border-amber-500/20';
  return 'bg-slate-500/15 text-slate-600 border-slate-500/20';
};

export const Columns: ColumnDef<ApprovalLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "request_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket ID" />
    ),
    cell: ({ row }) => {
      const request = row.original.request_id;
      if (!request) return <span className="font-mono text-xs font-bold">N/A</span>;

      return (
        <Link 
          to="/purchase-request/requests/$requestId" 
          params={{ requestId: String(request.id) }}
          className="font-mono text-xs font-bold text-primary hover:underline"
        >
          {request.ticket_id}
        </Link>
      );
    },
  },
  {
    accessorKey: "approver_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approver" />
    ),
    cell: ({ row }) => {
      const approver = row.original.approver_id;
      return <span className="truncate font-medium">{approver?.name || "System"}</span>;
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-bold">
          Level {row.getValue("level")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={cn("capitalize font-bold", getStatusColor(status))}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <span className="truncate">
          {date ? moment(date).format("LLL") : "-"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <LogViewDrawer log={row.original} />
    ),
  },
];
