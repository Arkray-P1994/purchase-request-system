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
      // 1. If it's the "Users" item...
      if (item.title === "Users") {
        // 2. ONLY show it if the user position is "admin" or "superadmin"
        return user?.user?.position === "superadmin" || user?.user?.position === "admin" || user?.user?.role === "admin";
      }
      // 3. Show all other items normally
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
