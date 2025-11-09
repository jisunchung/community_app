import { useAuth } from "@contexts/AuthContext";
import {
  addComment,
  deleteComment,
  deletePost,
  getComments,
  getPostById,
} from "@services/posts";
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
      Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleDelete = () => {
    if (!id) return;

    Alert.alert("게시물 삭제", "정말로 이 게시물을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
            Alert.alert("성공", "게시물이 삭제되었습니다.");
            router.back();
          } catch (error) {
            console.error("Failed to delete post:", error);
            Alert.alert("오류", "게시물 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("댓글 삭제", "정말로 이 댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComment(commentId);
            fetchPostAndComments();
          } catch (error) {
            console.error("Failed to delete comment:", error);
            Alert.alert("오류", "댓글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!id || !commentText.trim() || !user) {
      Alert.alert("입력 오류", "댓글 내용을 입력해주세요.");
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
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
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
        <Text>게시물을 찾을 수 없습니다.</Text>
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
              title="삭제"
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
                  <Button title="삭제" color="red" onPress={handleDelete} />
                </View>
              )}
              <View style={styles.separator} />
              <Text style={styles.commentsTitle}>댓글</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>아직 댓글이 없습니다.</Text>
            </View>
          }
        />
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="작성" onPress={handleAddComment} />
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
