import { useAuth } from "@contexts/AuthContext";
import { createPost } from "@services/posts";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Post as PostStrings,
  AlertMessage,
  Common,
  Auth as AuthStrings,
} from "@constants/strings";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            AlertMessage.PHOTO_PERMISSION,
            AlertMessage.PHOTO_PERMISSION_PROMPT
          );
        }
      }
    })();
  }, []);

  const _handlePhotoBtnPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert(Common.ERROR, AlertMessage.TITLE_CONTENT_REQUIRED);
      return;
    }
    if (!user) {
      Alert.alert(Common.ERROR, AlertMessage.LOGIN_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      await createPost({
        title,
        content,
        authorId: user.uid,
        authorEmail: user.email!,
      });
      router.back();
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert(Common.ERROR, AlertMessage.POST_CREATION_FAILED);
    } finally {
      setLoading(false);
    }
  };

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
      <Button title={PostStrings.SELECT_PHOTO} onPress={_handlePhotoBtnPress} />
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
