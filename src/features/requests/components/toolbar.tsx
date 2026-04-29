import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { debounce, useQueryState } from "nuqs";
import { DataTableViewOptions } from "../../../components/data-table/view-options";
import { DataTableFacetedFilter } from "../../../components/data-table/faceted-filter";
import { useTeams } from "@/api/fetch-teams";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send,
  Users
} from "lucide-react";

const STATUS_OPTIONS = [
  { label: "Pending", value: "1", icon: Clock },
  { label: "Approved", value: "2", icon: CheckCircle2 },
  { label: "Disapproved", value: "3", icon: AlertCircle },
  { label: "Released", value: "4", icon: Send },
  { label: "Under Approval", value: "5", icon: Clock },
];

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  const { teams } = useTeams();
  
  const [filter, setfilter] = useQueryState("filter", {
    defaultValue: "",
    shallow: true,
    clearOnDefault: true,
    limitUrlUpdates: debounce(500),
  });

  const [statusId, setStatusId] = useQueryState("status_id", {
    defaultValue: "",
    shallow: true,
    clearOnDefault: true,
  });

  const [teamId, setTeamId] = useQueryState("team_id", {
    defaultValue: "",
    shallow: true,
    clearOnDefault: true,
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    shallow: true,
  });

  const handleSearchChange = async (value: string | null) => {
    await setfilter(value || null);
    if (page !== "1") await setPage(null);
  };

  const isFiltered = filter !== "" || statusId !== "" || teamId !== "" || table.getState().columnFilters.length > 0;

  const teamOptions = teams.map((team: any) => ({
    label: team.name,
    value: String(team.id),
    icon: Users,
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={filter ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <div className="flex items-center gap-2">
          <DataTableFacetedFilter
            title="Status"
            options={STATUS_OPTIONS}
            // Overriding internal column logic since we use nuqs
            column={{
              getFilterValue: () => (statusId ? statusId.split(",") : []),
              setFilterValue: (val: any) => {
                setStatusId(val ? val.join(",") : null);
                setPage(null);
              },
              getFacetedUniqueValues: () => new Map(),
            } as any}
          />

          <DataTableFacetedFilter
            title="Team"
            options={teamOptions}
            column={{
              getFilterValue: () => (teamId ? teamId.split(",") : []),
              setFilterValue: (val: any) => {
                setTeamId(val ? val.join(",") : null);
                setPage(null);
              },
              getFacetedUniqueValues: () => new Map(),
            } as any}
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setfilter(null);
              setStatusId(null);
              setTeamId(null);
              setPage(null);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

