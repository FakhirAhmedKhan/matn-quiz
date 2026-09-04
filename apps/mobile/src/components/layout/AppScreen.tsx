import type {
  PropsWithChildren,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ColorValue,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useResponsiveLayout,
} from "../../hooks/useResponsiveLayout";

import {
  colors,
} from "../../theme";

type AppScreenProps =
  PropsWithChildren<{
    scroll?: boolean;

    keyboardAware?: boolean;

    style?:
      StyleProp<ViewStyle>;

    contentContainerStyle?:
      StyleProp<ViewStyle>;

    backgroundColor?:
      ColorValue;

    testID?: string;

    keyboardShouldPersistTaps?:
      ScrollViewProps["keyboardShouldPersistTaps"];
  }>;

export function AppScreen({
  children,
  scroll = true,
  keyboardAware = true,
  style,
  contentContainerStyle,
  backgroundColor =
    colors.backgroundSoft,
  testID,
  keyboardShouldPersistTaps =
    "handled",
}: AppScreenProps) {
  const layout =
    useResponsiveLayout();

  const innerContent = (
    <View
      testID={
        testID
      }
      style={[
        styles.inner,

        {
          maxWidth:
            layout.contentMaxWidth,

          paddingHorizontal:
            layout.horizontalPadding,
        },

        style,
      ]}
    >
      {children}
    </View>
  );

  const body =
    scroll ? (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps={
          keyboardShouldPersistTaps
        }
        keyboardDismissMode={
          Platform.OS === "ios"
            ? "interactive"
            : "on-drag"
        }
        overScrollMode="never"
      >
        {innerContent}
      </ScrollView>
    ) : (
      <View
        style={[
          styles.nonScroll,
          contentContainerStyle,
        ]}
      >
        {innerContent}
      </View>
    );

  return (
    <SafeAreaView
      edges={[
        "top",
        "left",
        "right",
        "bottom",
      ]}
      style={[
        styles.safeArea,

        {
          backgroundColor,
        },
      ]}
    >
      {keyboardAware ? (
        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          style={
            styles.keyboard
          }
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },

    keyboard: {
      flex: 1,
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      paddingTop: 8,
      paddingBottom: 24,
    },

    nonScroll: {
      flex: 1,
    },

    inner: {
      width: "100%",
      flexGrow: 1,
      alignSelf: "center",
    },
  });