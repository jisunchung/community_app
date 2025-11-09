import { useAuth } from "@contexts/AuthContext";
import { createPost } from "@services/posts";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { AlertMessage, Common } from "@constants/strings";

export function useCreatePost() {
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

  const handlePhotoBtnPress = async () => {
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

  return {
    title,
    setTitle,
    content,
    setContent,
    image,
    loading,
    handlePhotoBtnPress,
    handleCreatePost,
  };
}
