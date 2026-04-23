import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { EditRequestForm } from "../components/forms/edit-form";
import { useRequest } from "@/api/fetch-request";
import { useParams } from "@tanstack/react-router";

export function EditRequestPage() {
  const { requestId } = useParams({ from: "/purchase-request/requests/$requestId/edit" });
  const { data: request, isLoading } = useRequest({ id: requestId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-bold">Request Not Found</h2>
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
