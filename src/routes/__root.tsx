import { ThemeProvider } from "@/components/theme";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>
      </ThemeProvider>
    </>
  ),
});
