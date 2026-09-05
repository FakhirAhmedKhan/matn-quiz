import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
} from "expo-router";

import {
  useAuthStore,
} from "../../store/authStore";

import {
  colors,
  iconSize,
  radius,
  spacing,
} from "../../theme";

import {
  AppCard,
  AppText,
} from "../ui";

export function AccountProfileCard() {
  const router =
    useRouter();

  const status =
    useAuthStore(
      (
        state,
      ) =>
        state.status,
    );

  const user =
    useAuthStore(
      (
        state,
      ) =>
        state.user,
    );

  const authenticated =
    status ===
    "authenticated";

  const displayName =
    typeof user?.name ===
      "string" &&
    user.name.trim()
      ? user.name
      : typeof user?.email ===
          "string"
        ? user.email
        : "Matn Quiz account";

  return (
    <AppCard
      style={
        styles.card
      }
    >
      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.icon
          }
        >
          <Ionicons
            name={
              authenticated
                ? "person-circle-outline"
                : "person-outline"
            }
            size={
              iconSize.lg
            }
            color={
              colors.primary
            }
          />
        </View>

        <View
          style={
            styles.content
          }
        >
          <AppText
            variant="subheading"
          >
            {authenticated
              ? displayName
              : "Account"}
          </AppText>

          <AppText
            variant="caption"
            muted
            numberOfLines={1}
          >
            {authenticated
              ? typeof user?.email ===
                  "string"
                ? user.email
                : "Profile and cloud sync"
              : "Sign in to sync your study account"}
          </AppText>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          authenticated
            ? "Open profile"
            : "Sign in"
        }
        onPress={() => {
          router.push(
            authenticated
              ? ("/profile" as never)
              : ("/auth/login" as never),
          );
        }}
        style={({
          pressed,
        }) => [
          styles.button,

          pressed &&
            styles.pressed,
        ]}
      >
        <AppText
          variant="bodySmall"
          style={
            styles.buttonText
          }
        >
          {authenticated
            ? "Manage profile"
            : "Sign in"}
        </AppText>

        <Ionicons
          name="chevron-forward"
          size={
            iconSize.sm
          }
          color={
            colors.primary
          }
        />
      </Pressable>
    </AppCard>
  );
}

const styles =
  StyleSheet.create({
    card: {
      gap:
        spacing.lg,
    },

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap:
        spacing.md,
    },

    icon: {
      width:
        48,
      height:
        48,
      borderRadius:
        radius.pill,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.primarySoft,
    },

    content: {
      flex:
        1,
      minWidth:
        0,
      gap:
        spacing.xs,
    },

    button: {
      minHeight:
        44,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.sm,
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primarySoft,
      paddingHorizontal:
        spacing.md,
    },

    buttonText: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    pressed: {
      opacity:
        0.7,
    },
  });