import { Post } from "@types/Post";
import { router } from "expo-router";
import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Profile as ProfileStrings,
  Auth as AuthStrings,
  Common,
  Tabs,
} from "@constants/strings";
import { useProfile } from "@hooks/use-profile";
import { useLogin } from "@hooks/use-login";

export default function ProfileScreen() {
  const { user, posts, loading } = useProfile();
  const { handleLogout } = useLogin();

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
          <Text style={styles.title}>{Tabs.PROFILE}</Text>
          {user && <Text style={styles.email}>{user.email}</Text>}
          <Button title={AuthStrings.LOGOUT} onPress={handleLogout} />
        </View>
        <Text style={styles.myPostsTitle}>{ProfileStrings.MY_POSTS}</Text>
        {loading ? (
          <Text>{Common.LOADING}</Text>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            style={styles.postsList}
            ListEmptyComponent={<Text>{ProfileStrings.NO_POSTS_WRITTEN}</Text>}
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
