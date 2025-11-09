import { getPosts } from "@services/posts";
import { Post } from "@types/Post";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function usePostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const fetchedPosts = await getPosts();
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }, [])
  );

  return { posts, loading };
}
