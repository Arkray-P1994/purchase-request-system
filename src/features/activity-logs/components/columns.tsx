import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { LogViewDrawer } from "./log-view-drawer";

export type ActivityLog = {
  id: number;
  action: string;
  causer_id?: {
    name: string;
  };
  request_id?: {
    ticket_id: string;
  };
  properties?: any;
  created_at: string;
};

export const Columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "causer_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const causer = row.original.causer_id;
      return <span className="truncate font-medium">{causer?.name || "System"}</span>;
    },
  },
  {
    accessorKey: "request_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket ID" />
    ),
    cell: ({ row }) => {
      const request = row.original.request_id;
      return <span className="font-mono text-xs">{request?.ticket_id || "N/A"}</span>;
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <span className="font-medium capitalize">
        {row.getValue("action")}
      </span>
    ),
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
