import { useAsset } from "@/api/fetch-asset";
import { ConfigDrawer } from "@/components/layout/config-drawer";
import { Header } from "@/components/layout/header";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  History,
  Info,
  MapPin,
  Users,
} from "lucide-react";
import moment from "moment";
import React from "react";

// --- Types ---
export interface AssetData {
  id: number;
  asset_id: string;
  asset_name: string;
  date: string;
  location: string;
  department: string;
  model: string | null;
  serial: string | null;
  remarks: string;
  created_at: string;
  deleted_at: string | null;
  is_printed: number;
  status: number;
  status_name: string;
  team_name: string;
}

export interface AssetLog {
  id: number;
  asset_record_id: number;
  column_name: string;
  old_value: string;
  new_value: string;
  changed_by: number;
  changed_at: string;
  is_printed: number;
  username: string;
  changed_by_name: string;
}

export interface ApiResponse {
  success: boolean;
  data: AssetData;
  logs: AssetLog[];
}

const App = ({ id }: { id: number }) => {
  const { data, isLoading } = useAsset({ id }) as {
    data: ApiResponse | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data || !data.success) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <Header fixed activeHref="/client">
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <main className="max-w-7xl mx-auto px-4 pt-8">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                ID: {data.data.asset_id}
              </span>
              <Badge>{data.data.status_name}</Badge>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {data.data.asset_name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Info Card */}
            <Card>
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Info size={18} className="text-primary" />
                <h3 className="font-bold">Asset Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailItem
                    icon={<MapPin size={18} />}
                    label="Location"
                    value={data.data.location}
                  />
                  <DetailItem
                    icon={<Users size={18} />}
                    label="Team"
                    value={data.data.team_name}
                  />
                  <DetailItem
                    icon={<Calendar size={18} />}
                    label="Date"
                    value={moment(data.data.date).format("LL")}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                    Remarks
                  </p>
                  <p className="text-sm italic text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                    "{data.data.remarks}"
                  </p>
                </div>
              </div>
            </Card>

            {/* Audit Trail */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History size={20} className="text-muted-foreground" />
                <h3 className="text-lg font-bold">Audit Trail</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full border border-border">
                  {data.logs.length} entries
                </span>
              </div>

              <div className="space-y-4">
                {data.logs.length > 0 ? (
                  data.logs.map((log) => (
                    <div
                      key={log.id}
                      className="relative pl-8 border-l-2 border-border ml-3"
                    >
                      <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                      <Card className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-bold capitalize">
                            {log.column_name.replace("_", " ")}
                          </span>
                          <div className="text-[10px] text-muted-foreground text-right">
                            <p className="font-medium text-foreground">
                              {log.changed_by_name}
                            </p>
                            <p>{moment(log.changed_at).format("LL")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded border border-border/50">
                          <span className="text-xs text-muted-foreground line-through flex-1">
                            {log.old_value || "None"}
                          </span>
                          <ArrowRight
                            size={14}
                            className="text-muted-foreground"
                          />
                          <span className="text-xs font-bold text-blue-600 flex-1">
                            {log.new_value}
                          </span>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  /* Empty State Message */
                  <div className="text-center py-10 border-2 border-dashed rounded-lg border-border">
                    <p className="text-sm text-muted-foreground">
                      No asset logs found for this item.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground p-6 shadow-xl shadow-primary/10 border-none">
              <h4 className="text-xs font-bold uppercase opacity-80 mb-4">
                Summary
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-primary-foreground/20 pb-2">
                  <span className="opacity-90">Asset Age</span>
                  <span className="font-bold">
                    {calculateAge(data.data.date)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Styled Sub-components ---

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-500/20">
    {children}
  </span>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value || "N/A"}</p>
    </div>
  </div>
);

const calculateAge = (dateStr: string) => {
  const birthDate = new Date(dateStr);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}y ${months}m ${days}d`;
};

export default App;
