
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await login(email, password);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, padding:8, marginTop:8 }} autoCapitalize="none"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, padding:8, marginTop:8 }} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 16 }} onPress={() => navigation.navigate("Signup")}>Create a new account</Text>
    </View>
  );
}
