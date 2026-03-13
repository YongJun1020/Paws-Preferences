export interface Cat {
  id: number;
  catId: string;
  tags: string[];
  url: string;
  previewUrl: string;
}

export interface Session {
  id: number;
  date: string;
  time: string;
  liked: Cat[];
  disliked: Cat[];
  total: number;
  tag: string;
}
