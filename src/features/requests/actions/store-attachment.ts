import useSWRMutation from "swr/mutation";
import { baseUrl } from "@/lib/base-url";
import { toast } from "sonner";
import { mutate } from "swr";

async function storeAttachmentFetcher(
  url: string,
  { arg }: { arg: FormData },
) {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload attachment");
  }

  return response.json();
}

export function useStoreAttachment(requestId: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `${baseUrl}/store-attachment/${requestId}`,
    storeAttachmentFetcher,
    {
      onSuccess: () => {
        mutate(`${baseUrl}/request/${requestId}`);
      },
    },
  );

  return { trigger, isMutating, error };
}
