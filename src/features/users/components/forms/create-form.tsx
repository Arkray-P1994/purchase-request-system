import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field } from "@/components/forms/form-field";
import { useTeams } from "@/api/fetch-teams";
import { CreateUser, createUserSchema } from "../../schema";
import { useCreateUser } from "../../actions/mutate-users";
import { FormActions } from "./form-action";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const roles = [
  { name: "manager", id: "manager" },
  { name: "admin", id: "admin" },
  { name: "staff", id: "staff" },
  { name: "accounting_cash_release", id: "accounting_cash_release" },
];

interface CreateUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserForm({ open, onOpenChange }: CreateUserFormProps) {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { trigger, isMutating } = useCreateUser();

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "user",
      team_ids: [],
    },
  });

  async function onSubmit(data: CreateUser) {
    await trigger(data);
    onOpenChange(false);
    form.reset();
  }

  const isLoading = form.formState.isSubmitting || isMutating || teamsLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-6 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New User</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field
                control={form.control}
                name="name"
                label="Full Name"
                variant="input"
              />
              <Field
                control={form.control}
                name="email"
                label="Email"
                variant="input"
                type="email"
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
                type="password"
              />
              <Field
                control={form.control}
                name="role"
                label="Role"
                variant="select_by_name"
                selectOptions={roles}
              />
              <Field
                control={form.control}
                name="team_ids"
                label="Teams"
                variant="multi-select"
                options={teams}
              />
            <div className="mt-4">
              <FormActions
                action="create"
                isLoading={isLoading}
                onCancel={() => onOpenChange(false)}
              />
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
