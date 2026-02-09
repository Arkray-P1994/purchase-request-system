import App from "@/features/assets/id/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/asset-inventory/assets/$id")({
  loader: async ({ params }) => {
    const id = +params.id;
    if (!id) {
      throw new Error("Vendor not found");
    }
    return id;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const id = Route.useLoaderData();

  return <App id={id} />;
}
