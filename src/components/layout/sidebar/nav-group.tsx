import { type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from "./types";
import { useUser } from "@/api/fetch-user";
import { useTeamStore } from "@/store/use-team-store";

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar();
  const { user } = useUser();
  const { pathname } = useLocation();
  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);

  const processedItems = items.map((item) => {
    if (item.title.toLowerCase() === "requests" && user?.user?.teams) {
      return {
        ...item,
        items: user.user.teams.map((team: any) => ({
          title: team.name,
          url: item.url,
          id: team.id,
          icon: item.icon,
        })),
      };
    }
    return item;
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {processedItems.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items)
            return (
              <SidebarMenuLink
                key={key}
                item={item as NavLink}
                href={pathname}
                selectedTeamId={selectedTeamId}
              />
            );

          if (state === "collapsed" && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item as NavCollapsible}
                href={pathname}
                selectedTeamId={selectedTeamId}
              />
            );

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item as NavCollapsible}
              href={pathname}
              selectedTeamId={selectedTeamId}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function SidebarMenuLink({
  item,
  href,
  selectedTeamId,
}: {
  item: NavLink & { id?: string };
  href: string;
  selectedTeamId: string | null;
}) {
  const { setOpenMobile } = useSidebar();
  const setSelectedTeamId = useTeamStore((state) => state.setSelectedTeamId);
  const isActive = checkIsActive(href, item, false, selectedTeamId);
  const isSemiActive = checkIsSemiActive(href, item, selectedTeamId);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={
          isActive
            ? "bg-accent text-accent-foreground"
            : isSemiActive
              ? "bg-accent/50 text-accent-foreground"
              : ""
        }
        tooltip={item.title}
      >
        <Link
          to={item.url}
          // @ts-ignore
          search={item.search ? (prev: any) => ({ ...prev, ...item.search }) : undefined}
          onClick={() => {
            setOpenMobile(false);
            if (item.id) setSelectedTeamId(item.id);
          }}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({
  item,
  href,
  selectedTeamId,
}: {
  item: NavCollapsible;
  href: string;
  selectedTeamId: string | null;
}) {
  const { setOpenMobile } = useSidebar();
  const setSelectedTeamId = useTeamStore((state) => state.setSelectedTeamId);
  const isActive = checkIsActive(href, item, true, selectedTeamId);
  const isSemiActive = checkIsSemiActive(href, item, selectedTeamId);

  return (
    <Collapsible
      asChild
      defaultOpen={isActive || isSemiActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={
              isActive
                ? "bg-accent text-accent-foreground"
                : isSemiActive
                  ? "bg-accent/50 text-accent-foreground"
                  : ""
            }
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem: any) => {
              const isSubActive = checkIsActive(
                href,
                subItem,
                false,
                selectedTeamId,
              );

              return (
                <SidebarMenuSubItem key={`${subItem.title}-${subItem.id}`}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubActive}
                    className={
                      isSubActive ? "bg-accent text-accent-foreground" : ""
                    }
                  >
                    <Link
                      to={subItem.url}
                      onClick={() => {
                        setOpenMobile(false);
                        if (subItem.id) setSelectedTeamId(subItem.id);
                      }}
                    >
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
  selectedTeamId,
}: {
  item: NavCollapsible;
  href: string;
  selectedTeamId: string | null;
}) {
  const setSelectedTeamId = useTeamStore((state) => state.setSelectedTeamId);
  const isActive = checkIsActive(href, item, true, selectedTeamId);
  const isSemiActive = checkIsSemiActive(href, item, selectedTeamId);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={
              isActive
                ? "bg-accent text-accent-foreground"
                : isSemiActive
                  ? "bg-accent/50 text-accent-foreground"
                  : ""
            }
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub: any) => {
            const isSubActive = checkIsActive(href, sub, false, selectedTeamId);

            return (
              <DropdownMenuItem
                key={`${sub.title}-${sub.id || sub.url}`}
                asChild
              >
                <Link
                  to={sub.url}
                  onClick={() => {
                    if (sub.id) setSelectedTeamId(sub.id);
                  }}
                  className={`${isSubActive ? "bg-accent text-accent-foreground" : ""}`}
                >
                  {sub.icon && <sub.icon />}
                  <span className="max-w-52 text-wrap">{sub.title}</span>
                  {sub.badge && (
                    <span className="ms-auto text-xs">{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function checkIsActive(
  href: string,
  item: NavItem & { id?: string },
  mainNav = false,
  selectedTeamId: string | null,
) {
  const normalize = (u?: string) =>
    (u ?? "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  const hrefBase = normalize(href);
  const itemBase = normalize(item?.url);

  const isPathMatch = hrefBase === itemBase;

  if (item.id !== undefined && item.id !== null) {
    return isPathMatch && String(item.id) === String(selectedTeamId);
  }

  if (item.items && item.items.length > 0) {
    return item.items.some((sub: any) => {
      const subPathMatch = normalize(sub.url) === hrefBase;
      if (sub.id !== undefined && sub.id !== null) {
        return subPathMatch && String(sub.id) === String(selectedTeamId);
      }
      return subPathMatch;
    });
  }

  if (isPathMatch) return true;

  if (mainNav) {
    const hrefSeg = hrefBase.split("/")[1] || "";
    const itemSeg = itemBase.split("/")[1] || "";
    return hrefSeg !== "" && hrefSeg === itemSeg;
  }

  return false;
}

function checkIsSemiActive(
  href: string,
  item: NavItem & { id?: string },
  selectedTeamId: string | null,
) {
  const normalize = (u?: string) =>
    (u ?? "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  const hrefBase = normalize(href);
  const itemBase = normalize(item?.url);

  const isPathMatch = hrefBase === itemBase;

  if (isPathMatch) {
    if (
      item.id !== undefined &&
      item.id !== null &&
      String(selectedTeamId) !== String(item.id)
    ) {
      return true;
    }
    if (item.items && item.items.length > 0) {
      return !item.items.some(
        (sub: any) => String(sub.id) === String(selectedTeamId),
      );
    }
  }

  if (item.items && item.items.length > 0) {
    return item.items.some((sub: any) => {
      const subPathMatch = normalize(sub.url) === hrefBase;
      return (
        subPathMatch &&
        sub.id !== undefined &&
        sub.id !== null &&
        String(selectedTeamId) !== String(sub.id)
      );
    });
  }

  return false;
}
