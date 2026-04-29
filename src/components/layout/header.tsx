import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TopNav } from "./top-nav";
import { useUser } from "@/api/fetch-user";
import { sidebarData } from "./sidebar/sidebar-data";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
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

  const navLinks = sidebarData.navGroups
    .flatMap((group) => group.items)
    .filter((item) => {
      if (item.title === "Users") {
        return user?.user?.position === "superadmin" || user?.user?.position === "admin" || user?.user?.role === "admin";
      }
      return true;
    })
    .map((item) => ({
      title: item.title,
      url: item.url ?? "#",
      isActive: activeHref === item.url,
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
            "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg",
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
