import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TopNav } from "./top-nav";
import { useUser } from "@/api/fetch-user";

const defaultTopNav = [
  { title: "Dashboard", href: "/asset-inventory" },
  { title: "Assets", href: "/asset-inventory/assets" },
  { title: "Asset Logs", href: "/asset-inventory/asset-logs" },
  { title: "Categories", href: "/asset-inventory/categories" },
  { title: "Users", href: "/asset-inventory/users" },
];

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  /** current path or active href */
  activeHref?: string;
};

export function Header({
  className,
  fixed,
  children,
  activeHref,
  ...props
}: HeaderProps) {
  const [offset, setOffset] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  // Filter links based on user position and then map to include isActive state
  const navLinks = defaultTopNav
    .filter((item) => {
      // Hide "Users" tab if user is not an admin
      if (item.title === "Users") {
        return user?.user.position === "superadmin";
      }
      return true;
    })
    .map((item) => ({
      ...item,
      isActive: activeHref === item.href,
    }));

  return (
    <header
      className={cn(
        "z-50 h-16",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 p-4 sm:gap-4",
          offset > 10 &&
            fixed &&
            "after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg",
        )}
      >
        <SidebarTrigger variant="outline" className="max-md:scale-125" />
        <Separator orientation="vertical" className="h-6" />
        <TopNav links={navLinks} />
        {children}
      </div>
    </header>
  );
}
