"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useFormSettings } from "@/api/fetch-form-settings";
import { useUser } from "@/api/fetch-user";
import { DatePicker } from "@/components/date-picker";
import { Field } from "@/components/forms/form-field";
import {
  AssetFormValues,
  assetFormSchema,
  formatDateForSubmission,
} from "@/lib/utils";
import { useInsertAsset } from "../../actions/insert";
import { useUpdateAsset } from "../../actions/update";
import { FormActions } from "./form-action";

interface CreateFormProps {
  data?: Partial<AssetFormValues>;
  action: "create" | "update";
  setOpen: (open: boolean) => void;
}

export function AssetInsertForm({ data, action, setOpen }: CreateFormProps) {
  const { data: formSettings, isLoading: formSettingsLoading } =
    useFormSettings();
  const { user } = useUser();
  const { trigger, isMutating } = useInsertAsset();
  const { trigger: updateTrigger, isMutating: updateMutating } = useUpdateAsset(
    { id: Number(data?.id) },
  );

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      id: data?.id,
      asset_id: data?.asset_id ?? "",
      asset_name: data?.asset_name ?? "",
      location: data?.location ?? "",
      date: data?.date ? new Date(data.date) : undefined,
      model: data?.model ?? "",
      serial: data?.serial ?? "",
      remarks: data?.remarks ?? "",
      user_id: user.user.id ?? "",
      status: data?.status ?? 0,
      team_id: data?.team_id ?? 0,
      category_id: data?.category_id ?? 0,
      currency_id: data?.currency_id ?? 0,
      purchase_price: Number(data?.purchase_price) ?? 0,
      depreciated_value: Number(data?.depreciated_value) ?? 0,
    },
  });

  async function onSubmit(data: AssetFormValues) {
    const formData = new FormData();

    const formattedDate = data.date ? formatDateForSubmission(data.date) : "";

    // Append scalar fields (ensuring all are strings)
    formData.append("asset_id", data.asset_id);
    formData.append("asset_name", data.asset_name);
    formData.append("location", data.location ?? "");
    formData.append("date", formattedDate);
    formData.append("model", data.model ?? "");
    formData.append("serial", data.serial ?? "");
    formData.append("remarks", data.remarks ?? "");
    formData.append("purchase_price", String(data.purchase_price ?? 0));
    formData.append("depreciated_value", String(data.depreciated_value ?? 0));

    // Convert these to String to satisfy FormData requirements
    formData.append("user_id", String(data.user_id ?? ""));
    formData.append("status", String(data.status));
    formData.append("team_id", String(data.team_id));
    formData.append("category_id", String(data.category_id));
    formData.append("currency_id", String(data.currency_id));

    if (action === "create") {
      await trigger(formData);
      setOpen(false);
    } else {
      await updateTrigger(formData);
      setOpen(false);
    }
  }

  const isLoading =
    form.formState.isSubmitting ||
    isMutating ||
    updateMutating ||
    formSettingsLoading;

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Field
              control={form.control}
              name="asset_id"
              label="Asset ID"
              variant="input"
            />

            <Field
              control={form.control}
              name="asset_name"
              label="Asset Name"
              variant="input"
            />
            <DatePicker form={form} />

            <Field
              control={form.control}
              name="location"
              label="Location"
              variant="input"
            />
            <Field
              control={form.control}
              name="model"
              label="Model"
              variant="input"
            />

            <Field
              control={form.control}
              name="serial"
              label="Serial"
              variant="input"
            />
            <Field
              control={form.control}
              name="status"
              label="Status"
              variant="select"
              options={formSettings?.data?.statuses}
            />
            <Field
              control={form.control}
              name="team_id"
              label="Team"
              variant="select"
              options={formSettings?.data?.teams}
            />
            <Field
              control={form.control}
              name="category_id"
              label="Categories"
              variant="select"
              options={formSettings?.data?.categories}
            />
            <Field
              control={form.control}
              name="currency_id"
              label="Currency"
              variant="select"
              options={formSettings?.data?.currencies}
            />
            <Field
              control={form.control}
              name="purchase_price"
              label="Purchase Price"
              variant="input"
              type="number"
            />
            <Field
              control={form.control}
              name="depreciated_value"
              label="Depreciated Price"
              variant="input"
              type="number"
            />
            <Field
              control={form.control}
              name="remarks"
              label="Remarks"
              variant="textarea"
            />
            <FormActions
              action={action}
              isLoading={isLoading}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AssetInsertForm;
