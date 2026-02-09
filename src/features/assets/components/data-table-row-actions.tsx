// src/features/ledger/components/data-table-row-actions.tsx

import { LedgerActionsSheet } from "@/components/sheet/actions-sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  // TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { Eye, FilePlus } from "lucide-react";
import { useState } from "react";
import { useIdStore } from "../store";
import { DeleteAsset } from "./delete-asset";
import AssetInsertForm from "./forms/insert";
import { useUser } from "@/api/fetch-user";
// import { useState } from "react";
// import TooltipComponent from '@/components/tooltip'
// import { LedgerSheet } from './forms/view-ledger'
// import UpdateLedgerForm from './forms/update-ledger-form'
// import UpdateFilesForm from './forms/update-files-form'
// import { DeleteLedger } from '@/components/dialogs/delete-ledger'

interface DataTableRowActionsProps<TData extends { id: string | number }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string | number }>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const [openSheet, setOpenSheet] = useState(false);
  // const [openFile, setOpenFile] = useState(false);
  const { user: data } = useUser();
  const [open, setOpen] = useState(false);
  const { ids, updateSelectedId } = useIdStore();
  return (
    <div className="flex gap-1  items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/asset-inventory/assets/$id"
            params={{ id: row.original.id.toString() }}
          >
            <Button
              variant="ghost"
              className="cursor-pointer h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-blue-500"
            >
              <Eye className="h-4 w-4  text-blue-500 cursor-pointer" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>View</p>
        </TooltipContent>
      </Tooltip>

      {data.user.position === "admin" ||
        (data.user.position === "superadmin" && (
          <>
            <LedgerActionsSheet
              open={open}
              setOpen={setOpen}
              buttonName="asd"
              title="Edit Information"
              buttonType="edit"
            >
              <AssetInsertForm
                action={"update"}
                setOpen={setOpen}
                data={{
                  ...row.original,
                  id:
                    typeof row.original.id === "string"
                      ? Number(row.original.id)
                      : row.original.id,
                }}
              />
            </LedgerActionsSheet>
            <DeleteAsset Id={row.original.id} />

            <Tooltip>
              <TooltipTrigger asChild>
                {!ids.includes(Number(row.original.id)) && (
                  <Button
                    variant="ghost"
                    className="cursor-pointer h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600 text-yellow-500"
                    onClick={() =>
                      updateSelectedId([...ids, Number(row.original.id)])
                    }
                  >
                    <FilePlus />{" "}
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Add to print</p>
              </TooltipContent>
            </Tooltip>
          </>
        ))}

      {/* <DeleteLedger Id={row.original.id} /> */}
    </div>
  );
}
