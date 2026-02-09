import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { DataTableRowActions } from "./data-table-row-actions";
import { Vendor } from "./schema";

export const Columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "asset_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset ID" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">{row.getValue("asset_id")}</span>
    ),
  },
  {
    accessorKey: "asset_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
        {row.getValue("asset_name")}
      </span>
    ),
  },
  {
    accessorKey: "team_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("team_name")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("location")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="truncate">
        {row.getValue("date") ? moment(row.getValue("date")).format("LL") : "-"}
      </span>
    ),
  },
  {
    accessorKey: "status_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status_name") as string;

      // 1. Check if the value is null, undefined, or an empty string
      if (!status || status.trim() === "" || status.toLowerCase() === "null") {
        return <div className="pl-4 text-muted-foreground font-medium">-</div>;
      }

      // 2. Mapping for valid statuses
      const statusMap: Record<string, { label: string; className: string }> = {
        verified: {
          label: "verified",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        unverified: {
          label: "unverified",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        },
        not_found: {
          label: "not-found",
          className: "bg-red-50 text-red-700 border-red-200",
        },
      };

      const config = statusMap[status.toLowerCase()] || {
        label: status,
        className: "bg-gray-50 text-gray-600 border-gray-200",
      };

      return (
        <Badge
          variant="outline"
          className={`text-xs font-medium capitalize whitespace-nowrap ${config.className}`}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("model")}</span>
    ),
  },

  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("category_name")}</span>
    ),
  },
  {
    accessorKey: "currency_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("currency_name")}</span>
    ),
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchase Price" />
    ),
    cell: ({ row }) => {
      const value = Number(row.getValue("purchase_price"));

      return (
        <span className="truncate">
          {isNaN(value)
            ? "0.00"
            : value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </span>
      );
    },
  },
  {
    accessorKey: "depreciated_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depreciated Price" />
    ),
    cell: ({ row }) => {
      const value = Number(row.getValue("depreciated_value"));

      return (
        <span className="truncate">
          {isNaN(value)
            ? "0.00"
            : value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </span>
      );
    },
  },
  {
    accessorKey: "serial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serial" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("serial")}</span>
    ),
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => (
      <span className="max-w-32 truncate sm:max-w-72 md:max-w-[31rem]">
        {row.getValue("remarks")}
      </span>
    ),
  },

  // Uncomment if you need row actions
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
