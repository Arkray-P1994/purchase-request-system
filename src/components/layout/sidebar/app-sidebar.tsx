import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";
import { NavUser } from "./nav-user";
import { sidebarData } from "./sidebar-data";
import { useUser } from "@/api/fetch-user";
import { NavGroup } from "./nav-group";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { user } = useUser();

  // Filter nav groups based on user position
  const filteredNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.adminOnly) {
        const pos = user?.user?.position?.toLowerCase();
        const role = user?.user?.role?.toLowerCase();
        return pos === "admin" || pos === "superadmin" || role === "admin" || role === "superadmin";
      }
      return true;
    }),
  }));

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props: { title: any }) => (
          <NavGroup items={[]} key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
