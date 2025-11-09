import React from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth as AuthStrings } from "@constants/strings";
import { useLogin } from "@hooks/use-login";

export default function LoginScreen() {
  const {
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
  } = useLogin();

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
  label: {
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
