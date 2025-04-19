export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  uploadedBy: string;
  uploadedAt: number;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
}