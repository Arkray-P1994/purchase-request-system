import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export type AssetLog = {
  id: number;
  asset_record_id: {
    asset_name: string;
  };
  column_name: string;
  old_value: string;
  new_value: string;
  changed_by: {
    username: string;
  };
  changed_at: string;
};

export const Columns: ColumnDef<AssetLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "asset_record_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Name" />
    ),
    cell: ({ row }) => {
      const asset = row.original.asset_record_id;
      return <span className="truncate font-medium">{asset?.asset_name}</span>;
    },
  },
  {
    accessorKey: "column_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Column Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
        {row.getValue("column_name")}
      </span>
    ),
  },
  {
    accessorKey: "old_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Old Value" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("old_value")}</span>
    ),
  },
  {
    accessorKey: "new_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="New Value" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("new_value")}</span>
    ),
  },
  {
    accessorKey: "changed_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Changed By" />
    ),
    cell: ({ row }) => {
      const user = row.original.changed_by;
      return <span className="truncate font-medium">{user?.username}</span>;
    },
  },
  {
    accessorKey: "changed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("changed_at") as string;
      return (
        <span className="truncate">
          {date ? moment(date).format("LL") : "-"}
        </span>
      );
    },
  },
];
