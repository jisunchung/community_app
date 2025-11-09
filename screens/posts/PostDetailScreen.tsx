import { useAuth } from "@contexts/AuthContext";
import { deletePost, getPostById } from "@services/posts";
import { Post } from "@types/Post";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        Alert.alert("오류", "게시물을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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

  const isAuthor = user?.uid === post.authorId;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.metaContainer}>
        <Text style={styles.author}>{post.authorEmail}</Text>
        <Text style={styles.date}>
          {new Date(post.createdAt.seconds * 1000).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      {isAuthor && (
        <View style={styles.buttonContainer}>
          <Button title="삭제" color="red" onPress={handleDelete} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
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
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 32,
  },
});
