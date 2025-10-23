"use client";

import Image from "next/image";

interface AdBannerProps {
  variant?: "horizontal" | "vertical" | "square";
  size?: "small" | "medium" | "large";
  label?: string;
}

// Realistic ad mockups for different variants and sizes
const adMockups = {
  horizontal: {
    small: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/medium-horizontal-banner-advertisement-b-e21316e2-20251023110838.jpg",
    medium: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/modern-digital-advertisement-banner-hori-6381efe7-20251023110836.jpg",
    large: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/large-horizontal-banner-970x250px-brazil-09d682d7-20251023110836.jpg",
  },
  vertical: {
    small: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/vertical-skyscraper-advertisement-banner-3cab5967-20251023110835.jpg",
    medium: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/vertical-skyscraper-advertisement-banner-3cab5967-20251023110835.jpg",
    large: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/vertical-skyscraper-advertisement-banner-3cab5967-20251023110835.jpg",
  },
  square: {
    small: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/square-banner-ad-250x250px-brazilian-uni-83b0a966-20251023110835.jpg",
    medium: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/square-advertisement-banner-300x250px-br-be4d380b-20251023110837.jpg",
    large: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/square-advertisement-banner-300x250px-br-be4d380b-20251023110837.jpg",
  },
};

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

  const adImage = adMockups[variant][size];

  return (
    <div className={`relative w-full ${sizeClasses[size]} bg-muted/30 rounded-lg border border-border/50 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer`}>
      {/* Label */}
      <div className="absolute top-2 left-2 z-10">
        <span className="text-[10px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
          {label}
        </span>
      </div>

      {/* Ad Image */}
      <div className="absolute inset-0">
        <Image
          src={adImage}
          alt="Anúncio publicitário"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};