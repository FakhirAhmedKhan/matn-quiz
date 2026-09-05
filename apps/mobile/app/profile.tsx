import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  RequireAuth,
} from "../src/auth";

import {
  AccountSyncCard,
} from "../src/components/profile";

import {
  AppHeader,
  AppScreen,
} from "../src/components/layout";

import {
  AppCard,
  AppText,
} from "../src/components/ui";

import {
  useAuthStore,
} from "../src/store/authStore";

import {
  useProfileStore,
} from "../src/store/profileStore";

import {
  colors,
  radius,
  spacing,
} from "../src/theme";

function ProfileContent() {
  const router =
    useRouter();

  const profile =
    useProfileStore(
      (
        state,
      ) =>
        state.profile,
    );

  const status =
    useProfileStore(
      (
        state,
      ) =>
        state.status,
    );

  const error =
    useProfileStore(
      (
        state,
      ) =>
        state.error,
    );

  const refreshProfile =
    useProfileStore(
      (
        state,
      ) =>
        state.refreshProfile,
    );

  const updateProfile =
    useProfileStore(
      (
        state,
      ) =>
        state.updateProfile,
    );

  const logout =
    useAuthStore(
      (
        state,
      ) =>
        state.logout,
    );

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    initialized,
    setInitialized,
  ] =
    useState(false);

  useEffect(
    () => {
      if (
        !profile &&
        status !==
          "loading"
      ) {
        void refreshProfile();
      }
    },
    [
      profile,
      refreshProfile,
      status,
    ],
  );

  useEffect(
    () => {
      if (
        !profile
      ) {
        return;
      }

      setName(
        typeof profile.name ===
          "string"
          ? profile.name
          : "",
      );

      setEmail(
        typeof profile.email ===
          "string"
          ? profile.email
          : "",
      );

      setInitialized(
        true,
      );
    },
    [
      profile,
    ],
  );

  const saving =
    status ===
    "saving";

  const save =
    async () => {
      const normalizedName =
        name.trim();

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (
        normalizedName.length <
        2
      ) {
        Alert.alert(
          "Profile",
          "Enter a valid name.",
        );

        return;
      }

      if (
        !normalizedEmail ||
        !normalizedEmail.includes(
          "@",
        )
      ) {
        Alert.alert(
          "Profile",
          "Enter a valid email address.",
        );

        return;
      }

      const success =
        await updateProfile({
          name:
            normalizedName,

          email:
            normalizedEmail,
        });

      if (success) {
        Alert.alert(
          "Profile updated",
          "Your account information has been synchronized.",
        );
      }
    };

  const signOut =
    () => {
      Alert.alert(
        "Sign out",
        "Sign out of Matn Quiz on this device?",
        [
          {
            text:
              "Cancel",
            style:
              "cancel",
          },

          {
            text:
              "Sign out",
            style:
              "destructive",
            onPress:
              () => {
                void (
                  async () => {
                    await logout();

                    router.replace(
                      "/auth/login" as never,
                    );
                  }
                )();
              },
          },
        ],
      );
    };

  return (
    <AppScreen
      scroll
      keyboardAware
    >
      <AppHeader
        title="Profile"
        subtitle="Account and cloud synchronization"
        showBack
        onBack={() =>
          router.back()
        }
      />

      {!initialized &&
      status ===
        "loading" ? (
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
            muted
          >
            Loading profile...
          </AppText>
        </View>
      ) : (
        <>
          <AppCard
            style={
              styles.card
            }
          >
            <View
              style={
                styles.field
              }
            >
              <AppText
                variant="bodySmall"
                style={
                  styles.label
                }
              >
                Name
              </AppText>

              <TextInput
                accessibilityLabel="Profile name"
                value={
                  name
                }
                onChangeText={
                  setName
                }
                editable={
                  !saving
                }
                placeholder="Your name"
                placeholderTextColor={
                  colors.textMuted
                }
                style={
                  styles.input
                }
              />
            </View>

            <View
              style={
                styles.field
              }
            >
              <AppText
                variant="bodySmall"
                style={
                  styles.label
                }
              >
                Email
              </AppText>

              <TextInput
                accessibilityLabel="Profile email"
                value={
                  email
                }
                onChangeText={
                  setEmail
                }
                editable={
                  !saving
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={
                  false
                }
                placeholder="you@example.com"
                placeholderTextColor={
                  colors.textMuted
                }
                style={
                  styles.input
                }
              />
            </View>

            {error ? (
              <View
                accessibilityRole="alert"
                style={
                  styles.error
                }
              >
                <AppText
                  variant="bodySmall"
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </AppText>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save profile"
              disabled={
                saving
              }
              onPress={
                save
              }
              style={({
                pressed,
              }) => [
                styles.primaryButton,

                pressed &&
                  styles.pressed,

                saving &&
                  styles.disabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator
                  color={
                    colors.textInverse
                  }
                />
              ) : (
                <AppText
                  variant="bodySmall"
                  style={
                    styles.primaryText
                  }
                >
                  Save profile
                </AppText>
              )}
            </Pressable>
          </AppCard>

          <AccountSyncCard />

          <AppCard
            style={
              styles.card
            }
          >
            <AppText
              variant="subheading"
            >
              Session
            </AppText>

            <AppText
              variant="bodySmall"
              muted
            >
              Authentication tokens are kept in secure device storage.
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              onPress={
                signOut
              }
              style={({
                pressed,
              }) => [
                styles.logoutButton,

                pressed &&
                  styles.pressed,
              ]}
            >
              <AppText
                variant="bodySmall"
                style={
                  styles.logoutText
                }
              >
                Sign out
              </AppText>
            </Pressable>
          </AppCard>
        </>
      )}
    </AppScreen>
  );
}

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

const styles =
  StyleSheet.create({
    loading: {
      minHeight:
        240,
      alignItems:
        "center",
      justifyContent:
        "center",
      gap:
        spacing.md,
    },

    card: {
      gap:
        spacing.lg,
    },

    field: {
      gap:
        spacing.sm,
    },

    label: {
      color:
        colors.text,
      fontWeight:
        "700",
    },

    input: {
      minHeight:
        52,
      borderWidth:
        1,
      borderColor:
        colors.border,
      borderRadius:
        radius.lg,
      paddingHorizontal:
        spacing.md,
      backgroundColor:
        colors.surface,
      color:
        colors.text,
      fontSize:
        16,
    },

    error: {
      padding:
        spacing.md,
      borderRadius:
        radius.md,
      backgroundColor:
        colors.warningSoft,
    },

    errorText: {
      color:
        colors.warning,
      fontWeight:
        "700",
    },

    primaryButton: {
      minHeight:
        52,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.primary,
      paddingHorizontal:
        spacing.lg,
    },

    primaryText: {
      color:
        colors.textInverse,
      fontWeight:
        "800",
    },

    logoutButton: {
      minHeight:
        48,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.warningSoft,
      paddingHorizontal:
        spacing.md,
    },

    logoutText: {
      color:
        colors.warning,
      fontWeight:
        "800",
    },

    pressed: {
      opacity:
        0.72,
    },

    disabled: {
      opacity:
        0.5,
    },
  });