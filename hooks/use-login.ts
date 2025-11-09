import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Auth as AuthStrings, Common, AlertMessage } from "@constants/strings";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { login, signup, logout } = useAuth();
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
 const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert(AuthStrings.LOGOUT_FAILED_TITLE, error.message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isSignupMode,
    setIsSignupMode,
    handleLogin,
    handleSignup,
    handleLogout
  };
};
