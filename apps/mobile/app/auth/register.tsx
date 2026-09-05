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

export default function RegisterScreen() {
  const router =
    useRouter();

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
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
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

  const register =
    useAuthStore(
      (
        state,
      ) =>
        state.register,
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
        setValidationError(
          "Enter your name.",
        );

        return;
      }

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

      if (
        password !==
        confirmPassword
      ) {
        setValidationError(
          "Passwords do not match.",
        );

        return;
      }

      setValidationError(
        null,
      );

      const success =
        await register({
          name:
            normalizedName,

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

  const field = (
    label: string,
    value: string,
    onChangeText:
      (
        text: string,
      ) => void,
    options?: {
      secure?:
        boolean;

      email?:
        boolean;

      placeholder?:
        string;
    },
  ) => (
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
        {label}
      </AppText>

      <TextInput
        accessibilityLabel={
          label
        }
        value={
          value
        }
        onChangeText={
          onChangeText
        }
        placeholder={
          options?.placeholder ??
          label
        }
        placeholderTextColor={
          colors.textMuted
        }
        secureTextEntry={
          options?.secure
        }
        keyboardType={
          options?.email
            ? "email-address"
            : "default"
        }
        autoCapitalize={
          options?.email
            ? "none"
            : "words"
        }
        autoCorrect={
          false
        }
        editable={
          !isSubmitting
        }
        style={
          styles.input
        }
      />
    </View>
  );

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
          <AppText
            variant="title"
            align="center"
          >
            Create account
          </AppText>

          <AppText
            muted
            align="center"
          >
            Create your Matn Quiz account and sync your study progress.
          </AppText>
        </View>

        <AppCard
          style={
            styles.card
          }
        >
          {field(
            "Name",
            name,
            setName,
            {
              placeholder:
                "Your name",
            },
          )}

          {field(
            "Email",
            email,
            setEmail,
            {
              email:
                true,

              placeholder:
                "you@example.com",
            },
          )}

          {field(
            "Password",
            password,
            setPassword,
            {
              secure:
                true,

              placeholder:
                "At least 6 characters",
            },
          )}

          {field(
            "Confirm password",
            confirmPassword,
            setConfirmPassword,
            {
              secure:
                true,

              placeholder:
                "Repeat your password",
            },
          )}

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
            accessibilityLabel="Create account"
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
                Create account
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
            Already have an account?
          </AppText>

          <Pressable
            accessibilityRole="link"
            onPress={() =>
              router.replace(
                "/auth/login" as never,
              )
            }
          >
            <AppText
              variant="bodySmall"
              style={
                styles.link
              }
            >
              Sign in
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