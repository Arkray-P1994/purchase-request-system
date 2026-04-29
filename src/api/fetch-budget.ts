import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        const error = new Error(data.message || data.error || "Request failed");
        (error as any).status = res.status;
        throw error;
      });
    }
    return res.json();
  });

export function useBudgetEntries() {
  const url = `${import.meta.env.VITE_BUDGET_URL}/budget-entries`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data: data?.data,
    error,
    isLoading,
    status: (error as any)?.status,
  };
}
