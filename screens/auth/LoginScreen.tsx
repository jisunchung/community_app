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
import { Auth as AuthStrings, Common, AlertMessage } from "@constants/strings";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(Common.ERROR, AlertMessage.EMAIL_PASSWORD_REQUIRED);
      return;
    }
    try {
      await login(email, password);
      Alert.alert(Common.SUCCESS, AuthStrings.LOGIN_SUCCESS);
      router.replace("/(tabs)/posts");
    } catch (error: any) {
      let errorMessage = AlertMessage.LOGIN_FAILED;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = AlertMessage.USER_NOT_FOUND;
          break;
        case "auth/wrong-password":
          errorMessage = AlertMessage.WRONG_PASSWORD;
          break;
        case "auth/invalid-email":
          errorMessage = AlertMessage.INVALID_EMAIL;
          break;
        case "auth/too-many-requests":
          errorMessage = AlertMessage.TOO_MANY_REQUESTS;
          break;
      }
      Alert.alert(Common.ERROR, errorMessage);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(Common.ERROR, AlertMessage.FILL_ALL_FIELDS);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(Common.ERROR, AlertMessage.PASSWORD_MISMATCH);
      return;
    }
    try {
      await signup(email, password);
      Alert.alert(Common.SUCCESS, AuthStrings.SIGNUP_SUCCESS);
      router.replace("/(tabs)/posts");
    } catch (error: any) {
      let errorMessage = AlertMessage.SIGNUP_FAILED;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = AlertMessage.EMAIL_ALREADY_IN_USE;
          break;
        case "auth/weak-password":
          errorMessage = AlertMessage.WEAK_PASSWORD;
          break;
        case "auth/invalid-email":
          errorMessage = AlertMessage.INVALID_EMAIL;
          break;
      }
      Alert.alert(Common.ERROR, errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isSignupMode ? AuthStrings.SIGNUP : AuthStrings.LOGIN}
        </Text>
        <Text style={styles.label}>{AuthStrings.EMAIL}</Text>
        <TextInput
          style={styles.input}
          placeholder={AuthStrings.EMAIL}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>{AuthStrings.PASSWORD}</Text>
        <TextInput
          style={styles.input}
          placeholder={AuthStrings.PASSWORD}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isSignupMode && (
          <TextInput
            style={styles.input}
            placeholder={AuthStrings.CONFIRM_PASSWORD}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <Button
          title={isSignupMode ? AuthStrings.SIGNUP : AuthStrings.LOGIN}
          onPress={isSignupMode ? handleSignup : handleLogin}
        />
        <Pressable onPress={() => setIsSignupMode(!isSignupMode)}>
          <Text style={styles.link}>
            {isSignupMode
              ? AuthStrings.LOGIN_PROMPT
              : AuthStrings.SIGNUP_PROMPT}
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
  label:{
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
