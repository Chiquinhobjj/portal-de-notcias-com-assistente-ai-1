"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShortsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to reels mode with first video
    const redirectToReels = async () => {
      try {
        const res = await fetch("/api/videos?limit=1");
        if (res.ok) {
          const videos = await res.json();
          if (videos.length > 0) {
            router.replace(`/tv/reels/${videos[0].id}`);
          } else {
            router.replace("/tv");
          }
        } else {
          router.replace("/tv");
        }
      } catch (error) {
        console.error("Error redirecting to reels:", error);
        router.replace("/tv");
      }
    };

    redirectToReels();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecionando para modo Reels...</p>
      </div>
    </div>
  );
}
