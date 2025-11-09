import { getPosts } from "@services/posts";
import { Post } from "@types/Post";
import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostsListScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>{item.authorEmail}</Text>
      <Text style={styles.postDate}>
        {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>게시판</Text>
        <Link href="/post/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>새 글 작성</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text>게시물이 없습니다.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  postItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 14,
    color: "#555",
  },
  postDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  centerContainer: {
    marginTop: 50,
    alignItems: "center",
  },
});
