export interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  views: number;
  liked?: boolean;
  createdAt: string;
  publishedAt?: string;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: number;
}
