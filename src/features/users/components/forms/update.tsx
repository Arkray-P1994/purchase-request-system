"use client";

import { useTeams } from "@/api/fetch-teams";
import { Field } from "@/components/forms/form-field";
import { Form } from "@/components/ui/form";
import { updateuserFormSchema, UpdateUserFormValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateUser } from "../../actions/insert";
import { useUpdateUser } from "../../actions/update";
import { FormActions } from "./form-action";

const positions = [
  { name: "superadmin" },
  { name: "admin" },
  { name: "division manager" },
  { name: "manager" },
  { name: "staff" },
];
interface UserCreateFormProps {
  data?: Partial<UpdateUserFormValues>;
  action: "create" | "update";
  setOpen: (open: boolean) => void;
}

export default function UpdateUserForm({
  data,
  action,
  setOpen,
}: UserCreateFormProps) {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { trigger, isMutating } = useCreateUser();
  const { trigger: updateTrigger, isMutating: updateMutating } = useUpdateUser({
    id: Number(data?.id),
  });

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateuserFormSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name ?? "",
      username: data?.username ?? "",
      team_id: data?.team_id ?? 0,
      position: data?.position ?? "",
    },
  });

  async function onSubmit(data: UpdateUserFormValues) {
    const formData = new FormData();
    // Append scalar fields (ensuring all are strings)
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("position", data.position);
    formData.append("team_id", String(data.team_id));

    if (action === "create") {
      await trigger(formData);
      setOpen(false);
    } else {
      await updateTrigger(formData);
      setOpen(false);
    }
  }

  const isLoading =
    form.formState.isSubmitting || isMutating || updateMutating || teamsLoading;

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Field
              control={form.control}
              name="name"
              label="Full Name"
              variant="input"
            />

            <Field
              control={form.control}
              name="username"
              label="Username"
              variant="input"
            />

            <Field
              control={form.control}
              name="position"
              label="Position"
              variant="select_by_name"
              selectOptions={positions}
            />

            <Field
              control={form.control}
              name="team_id"
              label="Team"
              variant="select"
              options={teams.data}
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
