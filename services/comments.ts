import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { Comment } from "@types/Comment";
import { db } from "./firebaseApp";

const commentsCollection = collection(db, "comments");

export const addComment = async (comment: {
  postId: string;
  text: string;
  authorId: string;
  authorEmail: string;
}) => {
  return await addDoc(commentsCollection, {
    ...comment,
    createdAt: serverTimestamp(),
  });
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const q = query(
    commentsCollection,
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Comment)
  );
};

export const deleteComment = async (commentId: string) => {
  const commentDoc = doc(db, "comments", commentId);
  return await deleteDoc(commentDoc);
};
