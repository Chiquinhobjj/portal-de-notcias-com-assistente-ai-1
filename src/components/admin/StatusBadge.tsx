"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color?: string }> = {
  published: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "secondary" },
  active: { label: "Ativo", variant: "default" },
  paused: { label: "Pausado", variant: "secondary" },
  inactive: { label: "Inativo", variant: "destructive" },
  pending: { label: "Pendente", variant: "outline" },
  approved: { label: "Aprovado", variant: "default" },
  rejected: { label: "Rejeitado", variant: "destructive" },
};

export default function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status?.toLowerCase() || ''] || { 
    label: status || 'Desconhecido', 
    variant: variant || "secondary" 
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.color && `bg-${config.color}-100 text-${config.color}-800 border-${config.color}-200`,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
