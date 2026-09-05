import type {
  PropsWithChildren,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import {
  Redirect,
} from "expo-router";

import {
  useAuthStore,
} from "../store/authStore";

import {
  colors,
  spacing,
} from "../theme";

import {
  AppScreen,
} from "../components/layout";

import {
  AppText,
} from "../components/ui";

export function RequireAuth({
  children,
}: PropsWithChildren) {
  const status =
    useAuthStore(
      (
        state,
      ) =>
        state.status,
    );

  if (
    status ===
      "idle" ||
    status ===
      "bootstrapping"
  ) {
    return (
      <AppScreen>
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            size="large"
            color={
              colors.primary
            }
          />

          <AppText
            variant="bodySmall"
            muted
          >
            Restoring your session...
          </AppText>
        </View>
      </AppScreen>
    );
  }

  if (
    status ===
    "anonymous"
  ) {
    return (
      <Redirect
        href={
          "/auth/login" as never
        }
      />
    );
  }

  return children;
}

const styles =
  StyleSheet.create({
    loading: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.md,
    },
  });