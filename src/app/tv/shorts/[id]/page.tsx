"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ShortsPlayerPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to reels mode
    const videoId = params.id;
    if (videoId) {
      router.replace(`/tv/reels/${videoId}`);
    } else {
      router.replace("/tv");
    }
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white">Redirecionando para modo Reels...</p>
      </div>
    </div>
  );
}