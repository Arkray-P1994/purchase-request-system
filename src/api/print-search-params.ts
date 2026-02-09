import { useQueryState } from "nuqs";
import { useAssets } from "./fetch-assets";

export function useSearchParams(search: { filter?: string }) {
  // Pull params from URL/query state
  const filter = search.filter ?? "";

  const [page] = useQueryState("page", { defaultValue: "1" });
  // const [limit] = useQueryState("pageSize", { defaultValue: "all" });
  const [limit] = useQueryState("pageSize", { defaultValue: "all" });
  const [sort] = useQueryState("sort", { defaultValue: "location:asc" });
  const [remarks] = useQueryState("remarks", { defaultValue: "" });
  const [location] = useQueryState("location", { defaultValue: "" });
  // Call your data hook
  const { data, isLoading } = useAssets({
    page: String(page),
    limit: String(limit),
    filter: String(filter),
    sort: String(sort),
    remarks: String(remarks),
    location: String(location),
  });

  // Return the data and any extras you might need
  return { data, isLoading };
}
