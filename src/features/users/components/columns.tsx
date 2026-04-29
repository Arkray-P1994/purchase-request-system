import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./data-table-row-actions";
import { User } from "../schema";

export const Columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue("username")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <span className="truncate capitalize">{row.getValue("role")}</span>
    ),
  },
  {
    accessorKey: "team_names",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teams" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("team_names") || "None"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
