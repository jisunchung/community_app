import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
}
