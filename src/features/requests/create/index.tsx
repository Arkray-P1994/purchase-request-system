import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { CreateRequestForm } from "../components/forms/create-form";

export function CreateRequestPage() {
  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main fluid>
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            New Purchase Request
          </h2>
          <p className="text-muted-foreground mt-2">
            Initiate a new procurement process by providing the necessary
            details.
          </p>
        </div>

        <div className="pb-12">
          <CreateRequestForm />
        </div>
      </Main>
    </>
  );
}
