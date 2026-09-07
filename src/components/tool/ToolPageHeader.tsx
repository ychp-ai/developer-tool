import type { ReactNode } from 'react';

export interface ToolPageHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ToolPageHeader({
  icon,
  title,
  description,
}: ToolPageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-3 text-foreground">
        <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
