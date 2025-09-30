
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { createRitual } from "../services/ritualsService";

export default function NewRitualScreen({ navigation, user }) {
  const [title, setTitle] = useState("");

  async function handleCreate() {
    if (!title.trim()) return alert("Enter title");
    await createRitual(user.uid, { title, points: 10, active: true });
    navigation.goBack();
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Habit title" value={title} onChangeText={setTitle} style={{ borderWidth:1, padding:8 }} />
      <Button title="Create" onPress={handleCreate} />
    </View>
  );
}
