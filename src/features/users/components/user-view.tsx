import { useRequests } from "@/api/fetch-requests";
import { DataTable } from "@/components/table";
import { Columns } from "@/features/requests/components/columns";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/api/fetch-users";
import { useDataTableState } from "@/hooks/table-state";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  User as UserIcon,
  Shield,
  Users as TeamsIcon,
  Calendar,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function UserView({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data: userData, isLoading: userLoading } = useUsers({ id: userId });
  const user = userData?.data?.[0];

  const { page, limit, sort, globalFilter, tableState } = useDataTableState({
    pageKey: "uPage",
    limitKey: "uLimit",
    sortKey: "uSort",
    filterKey: "uFilter",
  });

  const { data: requestsData, isLoading: requestsLoading } = useRequests({
    page: String(page),
    limit: String(limit),
    sort: String(sort),
    filter: String(globalFilter),
    user_id: userId,
  });

  if (userLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">
            Loading user profile...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <Button
            variant="link"
            onClick={() => navigate({ to: "/purchase-request/users" })}
          >
            Go back to users list
          </Button>
        </div>
      </div>
    );

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate({ to: "/purchase-request/users" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-sm text-2xl">
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 font-semibold px-3 py-0.5"
                  >
                    {user.role}
                  </Badge>
                  <span className="text-muted-foreground text-sm flex items-center gap-1.5 ml-2">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm border-muted/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Username
                  </p>
                  <p className="text-sm font-medium mt-0.5">@{user.username}</p>
                </div>
                <Separator className="opacity-50" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Member Since
                  </p>
                  <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TeamsIcon className="h-4 w-4 text-muted-foreground" />
                  Assigned Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.team_names ? (
                    user.team_names
                      .split(",")
                      .map((team: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-muted hover:bg-muted/80 transition-colors"
                        >
                          {team.trim()}
                        </Badge>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No teams assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Request Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col justify-center h-full pt-1">
                  <p className="text-3xl font-bold tracking-tight text-primary">
                    {requestsData?.total ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total purchase requests created
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                Recent Requests
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                History of all procurement activities for this user.
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-background shadow-sm border-muted/60"
            >
              {requestsData?.total ?? 0} Records
            </Badge>
          </div>

          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <DataTable
              columns={Columns}
              data={requestsData ?? []}
              urlState={tableState}
              storageKey="user-requests-table"
            />
          </div>
        </div>
      </Main>
    </>
  );
}
