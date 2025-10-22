"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  source: string;
  timestamp: string;
  sources: number;
  variant?: "hero" | "standard" | "compact";
}

export default function NewsCard({
  id,
  title,
  description,
  image,
  category,
  source,
  timestamp,
  sources,
  variant = "standard",
}: NewsCardProps) {
  if (variant === "hero") {
    return (
      <Link href={`/article/${id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer border-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4" variant="secondary">
                {category}
              </Badge>
              <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                {title}
              </h2>
              {description && (
                <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>{sources} fontes</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
          <div className="grid grid-cols-3 gap-4 p-4">
            <div className="relative h-24 rounded-lg overflow-hidden col-span-1">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <Badge className="w-fit mb-2" variant="secondary" size="sm">
                  {category}
                </Badge>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{timestamp}</span>
                <span>{sources} fontes</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/article/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-6">
          <Badge className="w-fit mb-3" variant="secondary">
            {category}
          </Badge>
          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>{sources} fontes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
