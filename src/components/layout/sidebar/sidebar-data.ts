import {
  Container,
  LayoutDashboard,
  Logs,
  SquareStack,
  UserCog,
} from "lucide-react";
import type { SidebarData } from "./types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [],
  navGroups: [
    {
      title: "Pages",
      items: [
        {
          title: "Dashboard",
          url: "/asset-inventory",
          icon: LayoutDashboard,
        },
        {
          title: "Assets",
          url: "/asset-inventory/assets",
          icon: Container,
        },
        {
          title: "Asset Logs",
          url: "/asset-inventory/asset-logs",
          icon: Logs,
        },
        {
          title: "Categories",
          url: "/asset-inventory/categories",
          icon: SquareStack,
        },
        {
          title: "Users",
          url: "/asset-inventory/users",
          icon: UserCog,
        },
      ],
    },
  ],
};
