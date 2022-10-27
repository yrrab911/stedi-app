import React from "react";
import { SafeAreaView, StyleSheet, TextInput, Button, Alert } from "react-native";

const UselessTextInput = () => {
  const [text, onChangeText] = React.useState(null);

  return (
    <SafeAreaView>
      <TextInput
        style={StyleSheet.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="phone number"
      />
      <Button
        title="send text"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
    </SafeAreaView>
  );
};