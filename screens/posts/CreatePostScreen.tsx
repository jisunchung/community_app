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
            "Photo Permission",
            "Please turn on the camera permission."
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
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (!user) {
      Alert.alert("인증 오류", "로그인이 필요합니다.");
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
      Alert.alert("성공", "게시물이 성공적으로 작성되었습니다.");
      router.back();
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert("오류", "게시물 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새 글 작성</Text>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="사진 선택" onPress={_handlePhotoBtnPress} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="작성 완료" onPress={handleCreatePost} />
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
