import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Post as PostStrings } from "@constants/strings";
import { useCreatePost } from "@hooks/use-create-post";

export default function CreatePostScreen() {
  const {
    title,
    setTitle,
    content,
    setContent,
    image,
    loading,
    handlePhotoBtnPress,
    handleCreatePost,
  } = useCreatePost();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PostStrings.CREATE_NEW_POST}</Text>
      <Text style={styles.label}>{PostStrings.TITLE_PLACEHOLDER}</Text>
      <TextInput
        style={styles.input}
        placeholder={PostStrings.TITLE_PLACEHOLDER}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>{PostStrings.CONTENT_PLACEHOLDER}</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder={PostStrings.CONTENT_PLACEHOLDER}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title={PostStrings.SELECT_PHOTO} onPress={handlePhotoBtnPress} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button
          title={PostStrings.CREATE_COMPLETE}
          onPress={handleCreatePost}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  contentInput: {
    height: 150,
    paddingTop: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
});
