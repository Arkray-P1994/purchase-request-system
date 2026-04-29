import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field } from "@/components/forms/form-field";
import { useTeams } from "@/api/fetch-teams";
import { UpdateUser, updateUserSchema, User } from "../../schema";
import { useUpdateUser } from "../../actions/mutate-users";
import { FormActions } from "./form-action";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect } from "react";

const roles = [
  { name: "manager", id: "manager" },
  { name: "admin", id: "admin" },
  { name: "staff", id: "staff" },
  { name: "accounting_cash_release", id: "accounting_cash_release" },
];

interface EditUserFormProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserForm({ user, open, onOpenChange }: EditUserFormProps) {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { trigger, isMutating } = useUpdateUser();

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "user",
      team_ids: [],
    },
  });

  useEffect(() => {
    if (user && open) {
      const parsedTeams = user.team_ids 
        ? user.team_ids.split(',').map(id => parseInt(id, 10)) 
        : [];
      
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        password: "", // Keep password empty on edit unless changed
        team_ids: parsedTeams,
      });
    }
  }, [user, open, form]);

  async function onSubmit(data: UpdateUser) {
    if (!user) return;
    
    await trigger({ id: user.id, data });
    onOpenChange(false);
  }

  const isLoading = form.formState.isSubmitting || isMutating || teamsLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-6 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit User</SheetTitle>
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
                label="Password (Leave blank to keep)"
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
                action="update"
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
