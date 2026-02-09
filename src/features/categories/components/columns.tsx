import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";

import { Vendor } from "./schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const Columns: ColumnDef<Vendor>[] = [
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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue("name")}</span>
    ),
  },

  // Uncomment if you need row actions
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
