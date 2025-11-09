import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Comment } from "types/Comment";
import { Post } from "types/Post";
import { db } from "./firebaseApp";

const postsCollection = collection(db, "posts");
const commentsCollection = collection(db, "comments");

export const getPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Post)
  );
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  const postDocRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postDocRef);

  if (postSnap.exists()) {
    return { id: postSnap.id, ...postSnap.data() } as Post;
  } else {
    return null;
  }
};

export const createPost = async (post: {
  title: string;
  content: string;
  authorId: string;
  authorEmail: string;
}) => {
  return await addDoc(postsCollection, {
    ...post,
    createdAt: serverTimestamp(),
  });
};

export const deletePost = async (postId: string) => {
  const postDoc = doc(db, "posts", postId);
  return await deleteDoc(postDoc);
};

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
