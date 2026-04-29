import { Card } from "@/components/ui/card";
import { ArrowDown, ShieldCheck, Mail, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApproverSheet } from "./approver-sheet";
import { DeleteApprover } from "./delete-approver";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Approver {
  id: number;
  team_id: any;
  user_id: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  approval_level: number;
}

interface SortableApproverCardProps {
  approver: Approver;
  index: number;
  total: number;
  disabled?: boolean;
}

function SortableApproverCard({ approver, index, total, disabled }: SortableApproverCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: approver.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "w-full flex flex-col items-center",
        isDragging && "opacity-50 grayscale scale-95"
      )}
    >
      <Card className={cn(
        "w-full border border-muted/20 shadow-sm bg-card/95 backdrop-blur-md overflow-hidden transition-all duration-300 group relative z-10",
        !disabled && "hover:shadow-lg hover:border-primary/30"
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        
        <div className="flex items-center p-3 gap-4 relative">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/30 hover:text-primary transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <span className="text-[8px] font-black uppercase leading-none mb-0.5 opacity-60">Lvl</span>
            <span className="text-sm font-black leading-none">{index + 1}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold truncate text-foreground/90 group-hover:text-primary transition-colors">
                {approver.user_id?.name || "Unknown User"}
              </h3>
              <div className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[8px] font-bold text-blue-500 border border-blue-500/20 uppercase tracking-tight shrink-0">
                {approver.user_id?.role || "Member"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              <Mail className="h-2.5 w-2.5 text-primary/40 shrink-0" />
              <span className="truncate">{approver.user_id?.email || "No email"}</span>
            </div>
          </div>

          {!disabled && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ApproverSheet approver={approver} />
              {index === total - 1 && (
                <DeleteApprover id={approver.id} />
              )}
            </div>
          )}
        </div>
      </Card>

      {index < total - 1 && (
        <div className="relative flex flex-col items-center h-10 w-full group/connector">
          <div className="w-0.5 h-full bg-primary/5" />
          
          <div className="absolute -bottom-1 p-1 bg-background border border-primary/20 rounded-full shadow-sm z-20">
            <ArrowDown className="h-2 w-2 text-primary/40" />
          </div>
        </div>
      )}
    </div>
  );
}

export function ApproverFlow({ 
  approvers, 
  onOrderChange,
  isReordering = false
}: { 
  approvers: Approver[];
  onOrderChange?: (newOrder: Approver[]) => void;
  isReordering?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (approvers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-muted/5">
        <ShieldCheck className="h-6 w-6 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No approvers configured yet.</p>
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = approvers.findIndex((a) => a.id === active.id);
      const newIndex = approvers.findIndex((a) => a.id === over.id);
      onOrderChange?.(arrayMove(approvers, oldIndex, newIndex));
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-0 py-4 max-w-xl mx-auto">
      {/* Global Background Track & Flowing Light */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 z-0 pointer-events-none bg-primary/5">
        <div className="absolute w-full h-32 bg-gradient-to-b from-transparent via-primary to-transparent animate-[global-flow_6s_linear_infinite]" />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={approvers.map(a => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {approvers.map((approver, index) => (
            <SortableApproverCard 
              key={approver.id} 
              approver={approver} 
              index={index} 
              total={approvers.length} 
              disabled={isReordering}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes global-flow {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
