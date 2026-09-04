import type { ComponentProps } from "react";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  colors,
  iconSize,
  spacing,
  typography,
} from "../../src/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

function renderIcon(
  name: IconName,
  color: ColorValue,
) {
  return (
    <Ionicons
      name={name}
      size={iconSize.lg}
      color={color}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          minHeight: 68,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },

        tabBarLabelStyle: {
          fontSize: typography.caption,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) =>
            renderIcon("home-outline", color),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) =>
            renderIcon("create-outline", color),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) =>
            renderIcon("time-outline", color),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: "Books",
          tabBarIcon: ({ color }) =>
            renderIcon("book-outline", color),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) =>
            renderIcon("settings-outline", color),
        }}
      />
    </Tabs>
  );
}