import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { EditRequestForm } from "../components/forms/edit-form";
import { useRequest } from "@/api/fetch-request";
import { useUser } from "@/api/fetch-user";
import { useParams } from "@tanstack/react-router";
import Spinner from "@/components/ui/spinner";

export function EditRequestPage() {
  const { requestId } = useParams({ strict: false }) as any;
  const { data: request, isLoading } = useRequest({ id: requestId });
  const { user } = useUser();

  if (isLoading) {
    return <Spinner />;
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Request Not Found</h2>
      </div>
    );
  }

  const isAdmin = user?.user?.role?.toLowerCase() === "admin";
  const isCreator = String(user?.user?.id) === String(request?.user_id?.id);
  const statusName = request.status_id?.name || "";
  
  // Normal users can only edit Pending or Draft
  const isEditableForUser = ["Pending", "Draft"].includes(statusName);
  
  // Admins can edit almost anything, EXCEPT finalized accounting/approval states
  const isFinalized = ["For Cash Release", "Cash Released", "Approved", "Disapproved", "Rejected"].includes(statusName);
  const canAdminEdit = isAdmin && !isFinalized;

  if (isFinalized && isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Editing Locked</h2>
        <p className="text-muted-foreground text-center">
          Even as an Admin, you cannot edit requests that are already <span className="font-bold text-primary">{statusName}</span>.
        </p>
      </div>
    );
  }

  if (!canAdminEdit && !isEditableForUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Editing Forbidden</h2>
        <p className="text-muted-foreground text-center">
          This request is in <span className="font-bold text-orange-500">{statusName}</span> status and cannot be modified.
        </p>
      </div>
    );
  }

  if (!isAdmin && !isCreator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Unauthorized Access</h2>
        <p className="text-muted-foreground text-center">
          You do not have permission to edit this request. Only the creator or an administrator can modify it.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main className="max-w-8xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Edit Purchase Request
              </h2>
              <p className="text-muted-foreground mt-2">
                Update the details of your procurement process.
              </p>
          </div>
        </div>

        <div className="pb-12">
          <EditRequestForm initialData={request} />
        </div>
      </Main>
    </>
  );
}
