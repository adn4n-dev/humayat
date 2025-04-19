export interface Photo {
  _id: string;
  url: string;
  title: string;
  uploadedBy: string;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
}