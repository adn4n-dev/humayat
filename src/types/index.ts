export interface Photo {
  _id: string;
  id?: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  uploadedBy: string;
  uploadedAt?: string | number;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
}