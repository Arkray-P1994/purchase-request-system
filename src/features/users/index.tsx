import { Header } from "@/components/layout/header";
import { useSearch } from "@tanstack/react-router";

import { useUsers } from "@/api/fetch-users";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { useQueryState } from "nuqs";
import { DataTable } from "./components/table";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { CreateUserForm } from "./components/forms/create-form";

export function UsersPage() {
  const search = useSearch({ from: "/purchase-request/users/" }) as {
    filter?: string;
  };
  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });
  const [remarks] = useQueryState("remarks", { defaultValue: "" });
  const { data } = useUsers({
    page: String(page),
    limit: String(limit),
    filter: search.filter ? String(search.filter) : "",
    sort: String(sort),
    remarks: String(remarks),
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
               <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">System Users</h2>
              <p className="text-muted-foreground text-sm">
                Manage system users and their team assignments.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        <div className="-mx-4 flex-1 overflow-disable px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data ?? []} />
        </div>

        <CreateUserForm open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </Main>
    </>
  );
}
