import { Comment } from "@types/Comment";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Post as PostStrings,
  Comment as CommentStrings,
  Common,
} from "@constants/strings";
import PostContentView from "@components/posts/PostContentView";
import CommentInput from "@components/posts/CommentInput";
import { usePostDetail } from "@hooks/use-post-detail";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    post,
    comments,
    commentText,
    loading,
    user,
    setCommentText,
    handleDelete,
    handleDeleteComment,
    handleAddComment,
  } = usePostDetail(id);

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
          style={styles.list}
          ListHeaderComponent={
            <>
              <PostContentView post={post} onDelete={handleDelete} />
              <Text style={styles.commentsTitle}>
                {CommentStrings.COMMENTS_TITLE}
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>{CommentStrings.NO_COMMENTS}</Text>
            </View>
          }
        />
        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          onPress={handleAddComment}
        />
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
  list: {
    flex: 1,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  commentContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 8,
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
  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
