import { useQueryState } from "nuqs";
import { useAssets } from "./fetch-assets";

export function useSearchParams(search: { filter?: string }) {
  // Pull params from URL/query state
  const filter = search.filter ?? "";

  const [page] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("pageSize", { defaultValue: "10" });
  const [sort] = useQueryState("sort", { defaultValue: "" });
  const [remarks] = useQueryState("remarks", { defaultValue: "" });
  // Call your data hook
  const { data, isLoading } = useAssets({
    page: String(page),
    limit: String(limit),
    filter: String(filter),
    sort: String(sort),
    remarks: String(remarks),
  });

  // Return the data and any extras you might need
  return { data, isLoading };
}
