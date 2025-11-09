import { Post } from "@types/Post";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Common } from "@constants/strings";
import { useAuth } from "@contexts/AuthContext";

interface PostContentViewProps {
  post: Post;
  onDelete: () => void;
}

export default function PostContentView({
  post,
  onDelete,
}: PostContentViewProps) {
  const { user } = useAuth();
  return (
    <View style={styles.postContentContainer}>
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
          <Button title={Common.DELETE} color="red" onPress={onDelete} />
        </View>
      )}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  postContentContainer: {
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
});
