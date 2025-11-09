import { useAuth } from "@contexts/AuthContext";
import { addComment, deleteComment, getComments } from "@services/comments";
import { deletePost, getPostById } from "@services/posts";
import { Comment } from "@types/Comment";
import { Post } from "@types/Post";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Post as PostStrings,
  Comment as CommentStrings,
  CommonError,
  Common,
} from "@constants/strings";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      CommentStrings.DELETE_COMMENT_TITLE,
      CommentStrings.DELETE_COMMENT_CONFIRM,
      [
        { text: Common.CANCEL, style: "cancel" },
        {
          text: Common.DELETE,
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(commentId);
              fetchPostAndComments();
            } catch (error) {
              console.error("Failed to delete comment:", error);
              Alert.alert(
                CommonError.ERROR,
                CommentStrings.DELETE_FAILED_MESSAGE
              );
            }
          },
        },
      ]
    );
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <Text>{PostStrings.POST_NOT_FOUND}</Text>
      </View>
    );
  }

  const renderComment = ({ item }: { item: Comment }) => {
    const isCommentAuthor = user?.uid === item.authorId;
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.authorEmail}</Text>
          {isCommentAuthor && (
            <Button
              title={Common.DELETE}
              color="red"
              onPress={() => handleDeleteComment(item.id)}
            />
          )}
        </View>
        <Text>{item.text}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.createdAt.seconds * 1000).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContentContainer}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>{post.title}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.author}>{post.authorEmail}</Text>
                <Text style={styles.date}>
                  {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.content}>{post.content}</Text>
              {user?.uid === post.authorId && (
                <View style={styles.buttonContainer}>
                  <Button
                    title={Common.DELETE}
                    color="red"
                    onPress={handleDelete}
                  />
                </View>
              )}
              <View style={styles.separator} />
              <Text style={styles.commentsTitle}>
                {CommentStrings.COMMENTS_TITLE}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>{CommentStrings.NO_COMMENTS}</Text>
            </View>
          }
        />
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={CommentStrings.COMMENT_INPUT_PLACEHOLDER}
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button
            title={CommentStrings.ADD_COMMENT}
            onPress={handleAddComment}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsList: {
    flex: 1,
  },
  commentsContentContainer: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    paddingTop: 16,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  author: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 32,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 24,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
