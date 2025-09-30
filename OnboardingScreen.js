
import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createRitual } from "../services/ritualsService";

export default function OnboardingScreen({ navigation, user }) {
  const [text, setText] = useState("");

  async function handleCreate() {
    if (!text.trim()) return alert("Enter at least one ritual");
    const lines = text.split(/\n|,/).map(s => s.trim()).filter(Boolean);
    try {
      for (const title of lines) {
        await createRitual(user.uid, { title, category: "custom", points: 10, active: true });
      }
      navigation.navigate("Home");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome to Ritvana 🌸</Text>
      <Text style={{ marginTop: 8 }}>Which rituals will you practice daily? (one per line)</Text>
      <TextInput multiline value={text} onChangeText={setText} placeholder={"Drink 8 glasses of water\nSleep by 11pm\n15 min stretch"} style={{ borderWidth:1, padding:8, minHeight:100, marginTop:8 }} />
      <Button title="Save rituals" onPress={handleCreate} />
    </View>
  );
}
