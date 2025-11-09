import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      await login(email, password);
      router.replace("/(tabs)/posts");
    } catch (error: any) {
      let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "등록되지 않은 이메일입니다.";
          break;
        case "auth/wrong-password":
          errorMessage = "비밀번호가 틀렸습니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "너무 많은 로그인 시도로 계정이 일시적으로 잠겼습니다.";
          break;
      }
      Alert.alert("로그인 실패", errorMessage);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await signup(email, password);
      router.replace("/(tabs)/posts");
    } catch (error: any) {
      let errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "이미 가입된 이메일입니다.";
          break;
        case "auth/weak-password":
          errorMessage = "비밀번호는 6자 이상이어야 합니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
      }
      Alert.alert("회원가입 실패", errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{isSignupMode ? "회원가입" : "로그인"}</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isSignupMode && (
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <Button
          title={isSignupMode ? "회원가입" : "로그인"}
          onPress={isSignupMode ? handleSignup : handleLogin}
        />
        <Pressable onPress={() => setIsSignupMode(!isSignupMode)}>
          <Text style={styles.link}>
            {isSignupMode
              ? "이미 계정이 있으신가요? 로그인"
              : "계정이 없으신가요? 회원가입"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "blue",
  },
});
