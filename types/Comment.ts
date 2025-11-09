import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  postId: string;
  text: string;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
}
