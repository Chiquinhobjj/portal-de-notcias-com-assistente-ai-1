"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
  className,
}: RichTextEditorProps) {
  const [value, setValue] = useState(content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn("border rounded-lg", className)}>
      {/* Simple toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <span className="text-xs text-muted-foreground">
          Editor de texto simples (TipTap será integrado em breve)
        </span>
      </div>

      {/* Editor */}
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="min-h-[200px] border-0 focus-visible:ring-0"
        rows={10}
      />
    </div>
  );
}
