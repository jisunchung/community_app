import { Post } from "@types/Post";
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
import { db } from "./firebaseApp";

const postsCollection = collection(db, "posts");

export const getPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Post)
  );
};

export const getPostsByAuthor = async (authorId: string): Promise<Post[]> => {
  const q = query(
    postsCollection,
    where("authorId", "==", authorId),
    orderBy("createdAt", "desc")
  );
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
