import logo from "@/assets/arkray.png";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <img
          src={logo}
          alt="Logo"
          className={cn("h-8 w-auto object-contain")}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
