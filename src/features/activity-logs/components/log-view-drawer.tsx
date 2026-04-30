import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, User, Calendar, Activity, Tag, Hash, ChevronRight } from "lucide-react";
import type { ActivityLog } from "./columns";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LogViewDrawerProps {
  log: ActivityLog;
}

export function LogViewDrawer({ log }: LogViewDrawerProps) {
  const properties = typeof log.properties === 'string' 
    ? (() => { try { return JSON.parse(log.properties); } catch { return log.properties; } })()
    : log.properties;

  const getActionColor = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('create')) return 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20';
    if (a.includes('update')) return 'bg-blue-500/15 text-blue-600 border-blue-500/20';
    if (a.includes('delete')) return 'bg-rose-500/15 text-rose-600 border-rose-500/20';
    if (a.includes('approve')) return 'bg-amber-500/15 text-amber-600 border-amber-500/20';
    return 'bg-slate-500/15 text-slate-600 border-slate-500/20';
  };

  const renderProperties = (props: any) => {
    if (!props || typeof props !== 'object') return <p className="text-sm text-muted-foreground">{String(props)}</p>;

    // Handle "attributes"/"new" and "old" structure common in activity loggers
    const newValues = props.attributes || props.new;
    if (newValues || props.old) {
      const keys = Array.from(new Set([...Object.keys(newValues || {}), ...Object.keys(props.old || {})]))
        .filter(key => {
          const oldVal = props.old?.[key];
          const newVal = newValues?.[key];
          
          // If it's in 'old' but not in 'new', assume no change (delta update logic)
          if (oldVal !== undefined && newVal === undefined) return false;
          
          // If it's in 'new' but not in 'old', it's a new field addition
          if (oldVal === undefined && newVal !== undefined) return true;
          
          // If both exist, compare them
          if (oldVal !== undefined && newVal !== undefined) {
            // Deep compare for objects/arrays using JSON stringify
            if (typeof oldVal === 'object' || typeof newVal === 'object') {
              return JSON.stringify(oldVal) !== JSON.stringify(newVal);
            }
            // Simple comparison for primitives
            return String(oldVal) !== String(newVal);
          }
          
          return false;
        });
      
      if (keys.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-6 border rounded-xl border-dashed bg-muted/10">
            <p className="text-xs text-muted-foreground italic">No data changes recorded for this entry.</p>
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {keys.map(key => (
            <div key={key} className="rounded-lg border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{key.replace(/_/g, ' ')}</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                <div className="rounded bg-muted/50 p-2 text-xs break-all">
                  <span className="text-[10px] text-muted-foreground block mb-1 uppercase font-semibold tracking-tighter">Old</span>
                  {typeof props.old?.[key] === 'object' && props.old?.[key] !== null 
                    ? <pre className="whitespace-pre-wrap font-mono text-[10px] leading-tight text-muted-foreground">
                        {JSON.stringify(props.old[key], null, 2)}
                      </pre>
                    : String(props.old?.[key] ?? 'N/A')}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                <div className="rounded bg-primary/5 p-2 text-xs break-all border border-primary/10">
                  <span className="text-[10px] text-primary/70 block mb-1 uppercase font-semibold tracking-tighter">New</span>
                  {typeof newValues?.[key] === 'object' && newValues?.[key] !== null 
                    ? <pre className="whitespace-pre-wrap font-mono text-[10px] leading-tight text-primary/80">
                        {JSON.stringify(newValues[key], null, 2)}
                      </pre>
                    : String(newValues?.[key] ?? 'N/A')}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default JSON view for other objects
    return (
      <div className="rounded-xl bg-muted/30 p-4 border border-border/50 shadow-inner">
        <pre className="text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed text-foreground/80">
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg p-0 flex flex-col gap-0 border-l shadow-2xl">
        <div className="p-6 border-b bg-muted/20">
          <SheetHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-xl font-bold">Activity Log Details</SheetTitle>
            </div>
            <SheetDescription>
              A detailed snapshot of the system event recorded at {moment(log.created_at).format("HH:mm:ss")}.
            </SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {/* Essential Info Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/70">
                  <Tag className="h-4 w-4" /> Basic Information
                </h3>
                <Badge variant="outline" className={cn("px-2.5 py-0.5 font-bold uppercase tracking-wide text-[10px]", getActionColor(log.action))}>
                  {log.action}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border bg-card/50 flex flex-col gap-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Log ID
                  </span>
                  <span className="text-sm font-mono font-medium">#{log.id}</span>
                </div>
                <div className="p-4 rounded-xl border bg-card/50 flex flex-col gap-1.5 shadow-sm border-primary/20 bg-primary/[0.02]">
                  <span className="text-[10px] font-bold text-primary/70 uppercase flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Ticket ID
                  </span>
                  <span className="text-sm font-mono font-bold text-primary">
                    {log.request_id?.ticket_id || "N/A"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-card/50 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border shadow-inner">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Performed By</span>
                      <span className="text-sm font-semibold">{log.causer_id?.name || "System"}</span>
                    </div>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border shadow-inner">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Event Timestamp</span>
                    <span className="text-sm font-semibold">{moment(log.created_at).format("LLLL")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes Section */}
            <div className="space-y-4 pb-10">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/70">
                <Activity className="h-4 w-4" /> Changes & Properties
              </h3>
              
              {properties && (typeof properties === 'object' ? Object.keys(properties).length > 0 : true) ? (
                renderProperties(properties)
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-xl border-dashed bg-muted/10">
                  <Activity className="h-8 w-8 text-muted-foreground/20 mb-2" />
                  <p className="text-xs text-muted-foreground italic text-center">No metadata properties were recorded<br/>for this specific event.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20 flex justify-end">
           <SheetTrigger asChild>
             <Button variant="outline" className="h-9 px-6 font-medium">Close</Button>
           </SheetTrigger>
        </div>
      </SheetContent>
    </Sheet>
  );
}
