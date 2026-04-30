import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useUsers } from "@/api/fetch-users";
import { useTeams } from "@/api/fetch-teams";
import { useCreateApprover, useUpdateApprover } from "../actions/mutate-approvers";
import { Field } from "@/components/forms/form-field";
import { FormActions } from "@/features/users/components/forms/form-action";
import { toast } from "sonner";

const approverSchema = z.object({
  team_id: z.string().min(1, "Team is required"),
  user_id: z.string().min(1, "User is required"),
  approval_level: z.union([z.string(), z.number()]).refine((val) => val !== "", "Approval level is required"),
});

type ApproverFormValues = z.infer<typeof approverSchema>;

interface ApproverSheetProps {
  approver?: any;
  defaultTeamId?: string | number;
  nextLevel?: number;
}

export function ApproverSheet({ approver, defaultTeamId, nextLevel }: ApproverSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { data: usersData } = useUsers({ limit: "all" });
  const { teams } = useTeams();
  const createMutation = useCreateApprover();
  const updateMutation = useUpdateApprover();

  const getInitialId = (val: any) => {
    if (typeof val === "object" && val !== null) return val.id?.toString();
    return val?.toString() || "";
  };

  const form = useForm<ApproverFormValues>({
    resolver: zodResolver(approverSchema),
    defaultValues: {
      team_id: getInitialId(approver?.team_id) || defaultTeamId?.toString() || "",
      user_id: getInitialId(approver?.user_id) || "",
      approval_level: approver?.approval_level?.toString() || nextLevel?.toString() || "",
    },
  });

  React.useEffect(() => {
    if (open && !approver) {
      form.setValue("approval_level", nextLevel?.toString() || "");
    }
  }, [open, nextLevel, approver, form]);

  const isEditing = !!approver;
  const users = usersData?.data || [];

  async function onSubmit(values: ApproverFormValues) {
    const payload = {
      team_id: parseInt(values.team_id),
      user_id: parseInt(values.user_id),
      approval_level: typeof values.approval_level === "string" ? parseInt(values.approval_level) : values.approval_level,
    };

    if (isEditing) {
      await updateMutation.trigger({ id: approver.id, data: payload });
      toast.success("Approver updated successfully");
    } else {
      await createMutation.trigger(payload);
      toast.success("Approver added successfully");
    }
    setOpen(false);
    form.reset();
  }

  const isLoading = createMutation.isMutating || updateMutation.isMutating;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Approver
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md p-6 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? "Edit Approver" : "Add Approver"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Modify the approver details." : "Enter details for the new approver."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {!defaultTeamId && (
              <Field
                control={form.control}
                name="team_id"
                label="Team"
                variant="select_by_id"
                selectOptions={teams}
                readOnly={isEditing}
              />
            )}
            
            <Field
              control={form.control}
              name="user_id"
              label="User"
              variant="combobox_by_id"
              selectOptions={users}
              placeholder="Select a user..."
            />

            <Field
              control={form.control}
              name="approval_level"
              label="Approval Level"
              variant="input"
              type="number"
              placeholder="e.g. 1, 2, 3"
              readOnly={true}
            />

            <div className="mt-4">
              <FormActions
                action={isEditing ? "update" : "create"}
                isLoading={isLoading}
                onCancel={() => setOpen(false)}
              />
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
