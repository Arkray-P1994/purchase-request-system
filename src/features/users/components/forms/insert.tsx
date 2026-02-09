"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field } from "@/components/forms/form-field";
import { useTeams } from "@/api/fetch-teams";
import { userFormSchema, userFormValues } from "@/lib/utils";
import { FormActions } from "./form-action";
import { useCreateUser } from "../../actions/insert";

const positions = [
  { name: "superadmin" },
  { name: "admin" },
  { name: "division manager" },
  { name: "manager" },
  { name: "staff" },
];
interface UserCreateFormProps {
  action: "create" | "update";
  setOpen: (open: boolean) => void;
}

export default function CreateUserForm({
  action,
  setOpen,
}: UserCreateFormProps) {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { trigger, isMutating } = useCreateUser();

  const form = useForm<userFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      username: "",
      team_id: 0,
      position: "",
      password: "",
    },
  });

  async function onSubmit(data: userFormValues) {
    const formData = new FormData();
    // Append scalar fields (ensuring all are strings)
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("position", data.position);
    formData.append("password", data.password);
    formData.append("team_id", String(data.team_id));

    if (action === "create") {
      await trigger(formData);
      setOpen(false);
    }
  }

  const isLoading = form.formState.isSubmitting || isMutating || teamsLoading;

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
              name="password"
              label="Password"
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
