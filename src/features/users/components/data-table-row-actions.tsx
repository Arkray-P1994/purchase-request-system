// src/features/ledger/components/data-table-row-actions.tsx

import { LedgerActionsSheet } from "@/components/sheet/actions-sheet";
import type { Row } from "@tanstack/react-table";
import { useState } from "react";
import { DeleteUser } from "./delete-user";
import UpdateUserForm from "./forms/update";
import { ResetPassword } from "./reset-password";

interface DataTableRowActionsProps<TData extends { id: string | number }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { id: string | number }>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-1  items-center">
      <LedgerActionsSheet
        open={open}
        setOpen={setOpen}
        buttonName="asd"
        title="Edit Information"
        buttonType="edit"
      >
        <UpdateUserForm
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
      <ResetPassword Id={row.original.id} />
      <DeleteUser Id={row.original.id} />
    </div>
  );
}
