
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { listRituals, completeRitual } from "../services/ritualsService";
import { logout } from "../services/authService";

export default function HomeScreen({ navigation, user }) {
  const [rituals, setRituals] = useState([]);

  async function load() {
    const list = await listRituals(user.uid);
    setRituals(list);
  }

  useEffect(() => { load(); }, []);

  async function markDone(ritual) {
    await completeRitual(user.uid, ritual.id, ritual.points || 10);
    alert(`+${ritual.points || 10} points — nice!`);
    load();
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Today</Text>
      <Button title="Add ritual" onPress={() => navigation.navigate("NewRitual")} />
      <FlatList
        data={rituals}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding:12, marginTop:8, borderWidth:1, borderRadius:8 }}>
            <Text style={{ fontWeight:"600" }}>{item.title}</Text>
            <Text style={{ color:"#555" }}>Streak: {item.streak || 0}</Text>
            <Button title="Mark done" onPress={() => markDone(item)} />
          </View>
        )}
      />
      <Button title="Log out" onPress={() => logout()} />
    </View>
  );
}
