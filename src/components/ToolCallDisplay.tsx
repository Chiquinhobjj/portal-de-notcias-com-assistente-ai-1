"use client";

import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

interface ToolCallDisplayProps {
  tool_calls: ToolCall[];
}

export default function ToolCallDisplay({ tool_calls }: ToolCallDisplayProps) {
  if (!tool_calls || tool_calls.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-2 border-t border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <Wrench className="h-3 w-3 text-[#0EA5E9]" />
        <span className="text-xs font-medium text-muted-foreground">
          Ferramentas utilizadas:
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {tool_calls.map((tool, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs bg-gradient-to-r from-[#0EA5E9]/10 to-[#0C4A6E]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] hover:from-[#0EA5E9]/20 hover:to-[#0C4A6E]/20"
          >
            {tool.name}
            {Object.keys(tool.arguments).length > 0 && (
              <span className="ml-1 opacity-70">
                ({Object.keys(tool.arguments).length} parâmetros)
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
