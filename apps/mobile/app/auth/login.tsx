import {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  useAuthStore,
} from "../../src/store/authStore";

import {
  AppScreen,
} from "../../src/components/layout";

import {
  AppCard,
  AppText,
} from "../../src/components/ui";

import {
  colors,
  radius,
  spacing,
} from "../../src/theme";

export default function LoginScreen() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    validationError,
    setValidationError,
  ] =
    useState<string | null>(
      null,
    );

  const status =
    useAuthStore(
      (
        state,
      ) =>
        state.status,
    );

  const isSubmitting =
    useAuthStore(
      (
        state,
      ) =>
        state.isSubmitting,
    );

  const error =
    useAuthStore(
      (
        state,
      ) =>
        state.error,
    );

  const login =
    useAuthStore(
      (
        state,
      ) =>
        state.login,
    );

  const clearError =
    useAuthStore(
      (
        state,
      ) =>
        state.clearError,
    );

  useEffect(
    () => {
      if (
        status ===
        "authenticated"
      ) {
        router.replace(
          "/" as never,
        );
      }
    },
    [
      router,
      status,
    ],
  );

  const submit =
    async () => {
      clearError();

      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (
        !normalizedEmail ||
        !normalizedEmail.includes(
          "@",
        )
      ) {
        setValidationError(
          "Enter a valid email address.",
        );

        return;
      }

      if (
        password.length <
        6
      ) {
        setValidationError(
          "Password must contain at least 6 characters.",
        );

        return;
      }

      setValidationError(
        null,
      );

      const success =
        await login({
          email:
            normalizedEmail,

          password,
        });

      if (success) {
        router.replace(
          "/" as never,
        );
      }
    };

  return (
    <AppScreen
      scroll
      keyboardAware
    >
      <View
        style={
          styles.page
        }
      >
        <View
          style={
            styles.heading
          }
        >
          <View
            style={
              styles.brand
            }
          >
            <AppText
              variant="title"
              align="center"
            >
              Matn Quiz
            </AppText>
          </View>

          <AppText
            variant="title"
            align="center"
          >
            Welcome back
          </AppText>

          <AppText
            muted
            align="center"
          >
            Sign in to continue your study journey.
          </AppText>
        </View>

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
              Email
            </AppText>

            <TextInput
              accessibilityLabel="Email address"
              value={
                email
              }
              onChangeText={
                setEmail
              }
              placeholder="you@example.com"
              placeholderTextColor={
                colors.textMuted
              }
              autoCapitalize="none"
              autoCorrect={
                false
              }
              keyboardType="email-address"
              editable={
                !isSubmitting
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
              Password
            </AppText>

            <TextInput
              accessibilityLabel="Password"
              value={
                password
              }
              onChangeText={
                setPassword
              }
              placeholder="Enter your password"
              placeholderTextColor={
                colors.textMuted
              }
              secureTextEntry
              editable={
                !isSubmitting
              }
              style={
                styles.input
              }
            />
          </View>

          {validationError ||
          error ? (
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
                {
                  validationError ??
                  error
                }
              </AppText>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            disabled={
              isSubmitting
            }
            onPress={
              submit
            }
            style={({
              pressed,
            }) => [
              styles.primaryButton,

              pressed &&
                styles.pressed,

              isSubmitting &&
                styles.disabled,
            ]}
          >
            {isSubmitting ? (
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
                Sign in
              </AppText>
            )}
          </Pressable>
        </AppCard>

        <View
          style={
            styles.footer
          }
        >
          <AppText
            variant="bodySmall"
            muted
          >
            Don't have an account?
          </AppText>

          <Pressable
            accessibilityRole="link"
            onPress={() =>
              router.push(
                "/auth/register" as never,
              )
            }
          >
            <AppText
              variant="bodySmall"
              style={
                styles.link
              }
            >
              Create account
            </AppText>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles =
  StyleSheet.create({
    page: {
      flex: 1,
      justifyContent:
        "center",
      gap:
        spacing.xl,
      paddingVertical:
        spacing.xl,
    },

    heading: {
      gap:
        spacing.sm,
      alignItems:
        "center",
    },

    brand: {
      marginBottom:
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
      color:
        colors.text,
      backgroundColor:
        colors.surface,
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
      paddingHorizontal:
        spacing.lg,
      backgroundColor:
        colors.primary,
    },

    primaryText: {
      color:
        colors.textInverse,
      fontWeight:
        "800",
    },

    footer: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "center",
      alignItems:
        "center",
      gap:
        spacing.sm,
    },

    link: {
      color:
        colors.primary,
      fontWeight:
        "800",
    },

    pressed: {
      opacity:
        0.75,
    },

    disabled: {
      opacity:
        0.55,
    },
  });