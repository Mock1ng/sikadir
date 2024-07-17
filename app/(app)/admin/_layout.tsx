import { COLORS } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: COLORS.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="anggota"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="users" color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cogs" color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false
        }}
      />
    </Tabs>
  );
}
