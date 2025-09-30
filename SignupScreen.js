
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signup } from "../services/authService";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      await signup(email, password);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Sign up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, padding:8, marginTop:8 }} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, padding:8, marginTop:8 }} />
      <Button title="Create account" onPress={handleSignup} />
      <Text style={{ marginTop: 16 }} onPress={() => navigation.navigate("Login")}>Already have an account? Login</Text>
    </View>
  );
}
