import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";
import { Paperclip } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatusBadge } from "./status-badge";
import { DataTableRowActions } from "./row-actions";
import { Request } from "./schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Columns: ColumnDef<Request>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px] text-xs font-medium text-muted-foreground">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "ticket_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket ID" />
    ),
    cell: ({ row }) => (
      <Link
        to="/purchase-request/requests"
        search={{ requestId: String(row.original.id) }}
        className="truncate font-bold text-primary hover:underline underline-offset-4 text-xs"
      >
        {row.getValue("ticket_id")}
      </Link>
    ),
  },
  {
    accessorKey: "user_id.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester" />
    ),
    cell: ({ row }) => <div className="text-xs font-semibold">{row.original.user_id?.name || "N/A"}</div>,
  },
  {
    accessorKey: "team_id.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.original.team_id?.name || "N/A"}</div>,
  },

  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-xs text-muted-foreground">{row.getValue("remarks")}</div>
    ),
  },
  {
    accessorKey: "current_approver.user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Approver" />
    ),
    cell: ({ row }) => {
      const name = row.original.current_approver?.user?.name;
      const status = row.original.status_id?.name || "";
      const isFinalized = ["Approved", "Rejected", "Disapproved", "Released"].includes(status);
      
      if (status === "Draft") return <div className="text-xs font-medium text-muted-foreground italic">Draft</div>;
      if (!name || isFinalized) return <div className="text-xs font-medium text-muted-foreground italic">{status === 'Pending' ? 'Pending' : 'Finalized'}</div>;

      return (
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          {name}
        </div>
      );
    },
  },

  {
    accessorKey: "status_id.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.original.status_id?.name || "Pending"} />
    ),
  },

  {
    accessorKey: "desired_delivery_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Date" />
    ),
    cell: ({ row }) => <div>{row.getValue("desired_delivery_date")}</div>,
  },
  {
    accessorKey: "attachments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attachments" />
    ),
    cell: ({ row }) => {
      const attachments = row.original.attachments;
      if (!attachments || attachments.length === 0) return <span className="text-muted-foreground">-</span>;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-medium">
                  {attachments.length} {attachments.length === 1 ? "file" : "files"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-3">
              <p className="font-semibold border-b pb-1 mb-1">Attached Files:</p>
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                  <span>{file.file_name}</span>
                </div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
