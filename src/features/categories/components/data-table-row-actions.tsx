// src/features/ledger/components/data-table-row-actions.tsx

import { LedgerActionsSheet } from "@/components/sheet/actions-sheet";
import type { Row } from "@tanstack/react-table";
import { useState } from "react";
// import { useIdStore } from "../store";
// import { DeleteAsset } from "./delete-asset";
// import AssetInsertForm from "./forms/insert";
import { useUser } from "@/api/fetch-user";
import CategoryInsertForm from "./forms/insert";
import { DeleteCategory } from "./delete-category";
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
  // const { ids, updateSelectedId } = useIdStore();
  return (
    <div className="flex gap-1  items-center">
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
              <CategoryInsertForm
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
            <DeleteCategory Id={row.original.id} />
          </>
        ))}
      {/* {data.user.position === "admin" ||
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
          </>
        ))} */}

      {/* <DeleteLedger Id={row.original.id} /> */}
    </div>
  );
}
