"use client";

import { Field } from "@/components/forms/form-field";
import { Form } from "@/components/ui/form";
import { CategoryFormValues, categoriesFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useInsertCategory } from "../../actions/insert";
import { useUpdateCategory } from "../../actions/update";
import { FormActions } from "./form-action";

interface CreateFormProps {
  data?: Partial<CategoryFormValues>;
  action: "create" | "update";
  setOpen: (open: boolean) => void;
}

export function CategoryInsertForm({ data, action, setOpen }: CreateFormProps) {
  const { trigger, isMutating } = useInsertCategory();
  const { trigger: updateTrigger, isMutating: updateMutating } =
    useUpdateCategory({ id: Number(data?.id) });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoriesFormSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name ?? "",
    },
  });

  async function onSubmit(data: CategoryFormValues) {
    const formData = new FormData();

    // Append scalar fields (ensuring all are strings)
    formData.append("name", data.name);

    if (action === "create") {
      await trigger(formData);
      setOpen(false);
    } else {
      await updateTrigger(formData);
      setOpen(false);
    }
  }

  const isLoading = form.formState.isSubmitting || isMutating || updateMutating;
  return (
    <div className="min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Field
              control={form.control}
              name="name"
              label="Category Name"
              variant="input"
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

export default CategoryInsertForm;
