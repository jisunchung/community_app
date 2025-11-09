import React from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import {
  Comment as CommentStrings,
} from "@constants/strings";

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress: () => void;
}

export default function CommentInput({
  value,
  onChangeText,
  onPress,
}: CommentInputProps) {
  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder={CommentStrings.COMMENT_PLACEHOLDER}
        value={value}
        onChangeText={onChangeText}
      />
      <Button title={CommentStrings.ADD_COMMENT} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
});
