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
import { TeamSwitcher } from "./team-switcher";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/actions/logout";

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
        return (
          pos === "admin" ||
          pos === "superadmin" ||
          role === "admin" ||
          role === "superadmin"
        );
      }
      return true;
    }),
  }));

  const { trigger: logout } = useLogout();

  const finalNavGroups = filteredNavGroups.map((group) => {
    if (group.title === "Settings") {
      return {
        ...group,
        items: [
          ...group.items,
          {
            title: "Logout",
            url: "#",
            icon: LogOut,
            onClick: logout,
          },
        ],
      };
    }
    return group;
  });

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>{" "}
      <SidebarContent>
        {finalNavGroups.map((props: { title: any }) => (
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
