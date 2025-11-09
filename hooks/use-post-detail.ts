import { useAuth } from "@contexts/AuthContext";
import { addComment, deleteComment, getComments } from "@services/comments";
import { deletePost, getPostById } from "@services/posts";
import { Comment } from "@types/Comment";
import { Post } from "@types/Post";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  Post as PostStrings,
  Comment as CommentStrings,
  CommonError,
  Common,
} from "@constants/strings";

export function usePostDetail(id: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPostAndComments = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);
      const fetchedComments = await getComments(id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch post and comments:", error);
      Alert.alert(CommonError.ERROR, CommonError.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(Common.DELETE, PostStrings.DELETE_POST_CONFIRM, [
      { text: Common.CANCEL, style: "cancel" },
      {
        text: Common.DELETE,
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
            router.back();
          } catch (error) {
            console.error("Failed to delete post:", error);
            Alert.alert(CommonError.ERROR);
          }
        },
      },
    ]);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      fetchPostAndComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      Alert.alert(CommonError.ERROR, CommentStrings.DELETE_FAILED_MESSAGE);
    }
  };

  const handleAddComment = async () => {
    if (!id || !commentText.trim() || !user) {
      Alert.alert(CommonError.INPUT_ERROR, CommentStrings.COMMENT_REQUIRED);
      return;
    }

    try {
      await addComment({
        postId: id,
        text: commentText,
        authorId: user.uid,
        authorEmail: user.email!,
      });
      setCommentText("");
      fetchPostAndComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
      Alert.alert(CommonError.ERROR, CommentStrings.CREATE_FAILED_MESSAGE);
    }
  };

  return {
    post,
    comments,
    commentText,
    loading,
    user,
    setCommentText,
    handleDelete,
    handleDeleteComment,
    handleAddComment,
  };
}
