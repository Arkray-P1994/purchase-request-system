import {
  GitPullRequest,
  History,
  LayoutDashboard,
  Palette,
  ScrollText,
  ShieldCheck,
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
          url: "/purchase-request",
          icon: LayoutDashboard,
        },
        {
          title: "Requests",
          url: "/purchase-request/requests",
          icon: ScrollText,
        },
        {
          title: "History",
          url: "/history",
          icon: History,
          adminOnly: true,
        },
        {
          title: "Timeline",
          url: "/purchase-request/timeline",
          icon: GitPullRequest,
          adminOnly: true,
        },
        {
          title: "Users",
          url: "/purchase-request/users",
          icon: UserCog,
          adminOnly: true,
        },
        {
          title: "Team Approvers",
          url: "/purchase-request/team-approvers",
          icon: ShieldCheck,
          adminOnly: true,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Theme",
          url: "/purchase-request/settings/theme",
          icon: Palette,
        },
      ],
    },
  ],
};
