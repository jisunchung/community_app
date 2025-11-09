import { useAuth } from "@contexts/AuthContext";
import { getPostsByAuthor } from "@services/posts";
import { Post } from "@types/Post";
import {  useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import {  CommonError } from "@constants/strings";

export const useProfile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPosts = async () => {
        if (user) {
          try {
            setLoading(true);
            const userPosts = await getPostsByAuthor(user.uid);
            setPosts(userPosts);
          } catch (error) {
            console.error("Failed to fetch user posts:", error);
            Alert.alert(CommonError.ERROR, CommonError.FETCH_FAILED);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchUserPosts();
    }, [user])
  );

  return { user, posts, loading };
};
