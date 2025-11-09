import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
interface DashboardWidgetProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}
export function DashboardWidget({ id, children, className }: DashboardWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className={cn('relative group', className)}>
      <div
        className={cn(
          'absolute top-3 right-3 z-10 p-1.5 rounded-md bg-background/50 border border-border/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isDragging && 'cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-momentum-dark-slate" />
      </div>
      {children}
    </div>
  );
}