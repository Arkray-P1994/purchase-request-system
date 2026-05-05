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

  const isAdmin = user?.user?.role === "admin";
  const isCreator = String(user?.user?.id) === String(request?.user_id?.id);
  const canEdit = isAdmin || isCreator;

  if (!["Pending", "Draft"].includes(request.status_id?.name || "")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Editing Forbidden</h2>
        <p className="text-muted-foreground text-center">
          Only requests with <span className="font-bold text-orange-500">Pending</span> or <span className="font-bold text-slate-500">Draft</span> status can be edited.
        </p>
      </div>
    );
  }

  if (!canEdit) {
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
