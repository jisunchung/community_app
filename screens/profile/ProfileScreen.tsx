import { useAuth } from "@contexts/AuthContext";
import { getPostsByAuthor } from "@services/posts";
import { Post } from "@types/Post";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
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
            Alert.alert("오류", "게시글을 불러오는 데 실패했습니다.");
          } finally {
            setLoading(false);
          }
        }
      };

      fetchUserPosts();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDate}>
        {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Text style={styles.title}>Profile</Text>
          {user && <Text style={styles.email}>{user.email}</Text>}
          <Button title="로그아웃" onPress={handleLogout} />
        </View>
        <Text style={styles.myPostsTitle}>내 게시글</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            style={styles.postsList}
            ListEmptyComponent={<Text>작성한 게시글이 없습니다.</Text>}
          />
        )}
      </View>
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
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  myPostsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  postsList: {
    flex: 1,
  },
  postItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
    color: "#999",
  },
});
