import { useDashboard } from "@/api/fetch-dashboard";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Search,
  TrendingDown,
} from "lucide-react";
import { AssetDistribution } from "./components/asset-distribution";
import { CategoryDistribution } from "./components/category-bar";
import { YearlyDistrubutionCategory } from "./components/category-yearly";
import { Overview } from "./components/overview";
import { TeamChart } from "./components/team-chart";

export default function App() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <Spinner />;

  const totalAssets = data?.summary?.total_assets ?? 0;
  const verified = data?.breakdowns?.status_distribution?.verified?.count ?? 0;
  const unverified =
    data?.breakdowns?.status_distribution?.unverified?.count ?? 0;
  const notFound = data?.breakdowns?.status_distribution?.not_found?.count ?? 0;

  return (
    <>
      <Header fixed activeHref="/client">
        <div className="ms-auto flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="http://192.168.208.5/asset-inventory-api/Asset%20Inventory%20System%20-%20User%20Manual.pdf"
                target="_blank"
              >
                <QuestionMarkCircledIcon className="w-5 h-5 text-red-500 " />
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Users Manual</p>
            </TooltipContent>
          </Tooltip>
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            FIX Asset Monitoring System
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Assets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Purchase Price
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "JPY",
                  maximumFractionDigits: 0,
                }).format(data?.summary?.total_spent)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Depreciated Value
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "JPY",
                  maximumFractionDigits: 0,
                }).format(data?.summary?.total_depreciated)}
              </div>
            </CardContent>
          </Card>
          {/* Verified Assets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {verified.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalAssets > 0
                  ? ((verified / totalAssets) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          {/* Unverified Assets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unverified</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unverified.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending verification
              </p>
            </CardContent>
          </Card>

          {/* Not Found */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Found</CardTitle>
              <Search className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notFound.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Missing during audit
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <Overview data={data.breakdowns.yearly_overall} />
          <AssetDistribution data={data.breakdowns.status_distribution} />
        </div>

        <div className="mt-4">
          <YearlyDistrubutionCategory
            data={data.breakdowns.yearly_by_category}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <TeamChart data={data.breakdowns.team_distribution} />
          <CategoryDistribution data={data.breakdowns.lifetime_by_category} />
        </div>
      </Main>
    </>
  );
}
