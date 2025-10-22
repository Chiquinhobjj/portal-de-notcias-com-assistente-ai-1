"use client";

interface AdBannerProps {
  variant?: "horizontal" | "vertical" | "square";
  size?: "small" | "medium" | "large";
  label?: string;
}

export const AdBanner = ({ 
  variant = "horizontal", 
  size = "medium",
  label = "Publicidade" 
}: AdBannerProps) => {
  const sizeClasses = {
    small: variant === "horizontal" ? "h-24" : variant === "vertical" ? "h-64" : "h-32",
    medium: variant === "horizontal" ? "h-32" : variant === "vertical" ? "h-96" : "h-48",
    large: variant === "horizontal" ? "h-48" : variant === "vertical" ? "h-[600px]" : "h-64",
  };

  return (
    <div className={`relative w-full ${sizeClasses[size]} bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50 overflow-hidden group hover:border-border transition-all`}>
      {/* Label */}
      <div className="absolute top-2 left-2 z-10">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 bg-background/80 px-2 py-0.5 rounded-full">
          {label}
        </span>
      </div>

      {/* Mock Ad Content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📢</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Espaço Publicitário
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Anuncie aqui e alcance milhares de leitores
          </p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
