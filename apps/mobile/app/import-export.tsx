import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Share, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import {
  ExportInfoCard,
  TransferPreviewCard,
  TransferStatusBanner,
} from "../src/components/import-export";
import { AppHeader, AppScreen } from "../src/components/layout";
import { AppButton, AppCard, AppInput, AppText } from "../src/components/ui";
import { useQuizStore } from "../src/store/quizStore";
import {
  buildQuizTransferDocument,
  createDemoImportJson,
  parseQuizTransferJson,
  serializeQuizTransfer,
} from "../src/utils/quizTransfer";
import {
  getArabicInputStats,
  validateArabicInput,
} from "../src/utils/arabicInput";
import { getMaximumHideCount } from "../src/utils/quizSetup";
import { colors, iconSize, radius, spacing } from "../src/theme";

type ActionStatus = {
  kind: "success" | "info";
  message: string;
} | null;

export default function ImportExportScreen() {
  const text = useQuizStore((state) => state.text);

  const method = useQuizStore((state) => state.method);

  const hideCount = useQuizStore((state) => state.hideCount);

  const setText = useQuizStore((state) => state.setText);

  const setMethod = useQuizStore((state) => state.setMethod);

  const setHideCount = useQuizStore((state) => state.setHideCount);

  const [importText, setImportText] = useState("");

  const [actionStatus, setActionStatus] = useState<ActionStatus>(null);

  const currentValidation = validateArabicInput(text);

  const currentStats = getArabicInputStats(text);

  const currentMaximum = getMaximumHideCount(
    method,
    currentStats.words,
    currentStats.lines,
  );

  const exportReady =
    currentValidation.valid &&
    currentMaximum >= 1 &&
    hideCount >= 1 &&
    hideCount <= currentMaximum;

  const exportDocument = useMemo(
    () => buildQuizTransferDocument(text, method, hideCount),
    [text, method, hideCount],
  );

  const exportJson = useMemo(
    () => serializeQuizTransfer(exportDocument),
    [exportDocument],
  );

  const importResult = useMemo(
    () => parseQuizTransferJson(importText),
    [importText],
  );

  async function copyExport() {
    if (!exportReady) {
      return;
    }

    await Clipboard.setStringAsync(exportJson);

    setActionStatus({
      kind: "success",
      message: "Quiz draft JSON copied to clipboard.",
    });
  }

  async function shareExport() {
    if (!exportReady) {
      return;
    }

    await Share.share({
      title: "Matn Quiz Draft",
      message: exportJson,
    });

    setActionStatus({
      kind: "info",
      message: "Share dialog opened for this quiz draft.",
    });
  }

  async function pasteFromClipboard() {
    const value = await Clipboard.getStringAsync();

    if (!value.trim()) {
      setActionStatus({
        kind: "info",
        message: "Clipboard does not contain text to import.",
      });

      return;
    }

    setImportText(value);

    setActionStatus({
      kind: "info",
      message: "Clipboard text loaded. Check the validation preview below.",
    });
  }

  function loadDemoImport() {
    setImportText(createDemoImportJson());

    setActionStatus({
      kind: "info",
      message: "Demo Matn Quiz export loaded.",
    });
  }

  function clearImport() {
    setImportText("");
    setActionStatus(null);
  }

  function applyImport() {
    if (!importResult.valid) {
      return;
    }

    const draft = importResult.document.draft;

    setText(draft.text);

    setMethod(draft.method);

    setHideCount(draft.hideCount);

    setActionStatus({
      kind: "success",
      message: "Imported quiz draft applied successfully.",
    });

    router.replace("/create/method");
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Import / Export"
          subtitle="Move quiz drafts safely"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="swap-horizontal-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">Quiz Draft Transfer</AppText>

            <AppText muted>
              Export a quiz as JSON or restore a previously exported Matn Quiz
              draft.
            </AppText>
          </View>
        </View>

        {actionStatus ? (
          <View
            style={[
              styles.actionStatus,
              actionStatus.kind === "success"
                ? styles.successStatus
                : styles.infoStatus,
            ]}
          >
            <Ionicons
              name={
                actionStatus.kind === "success"
                  ? "checkmark-circle-outline"
                  : "information-circle-outline"
              }
              size={iconSize.md}
              color={
                actionStatus.kind === "success"
                  ? colors.success
                  : colors.primary
              }
            />

            <AppText variant="bodySmall" style={styles.actionStatusText}>
              {actionStatus.message}
            </AppText>
          </View>
        ) : null}

        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitle}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">Export Current Draft</AppText>
          </View>

          <AppText variant="caption" muted>
            JSON version 1
          </AppText>
        </View>

        {exportReady ? (
          <TransferPreviewCard
            document={exportDocument}
            title="Current Quiz Draft"
          />
        ) : (
          <AppCard style={styles.notReadyCard}>
            <Ionicons
              name="warning-outline"
              size={iconSize.md}
              color={colors.warning}
            />

            <View style={styles.notReadyText}>
              <AppText variant="subheading">Draft Not Ready to Export</AppText>

              <AppText variant="bodySmall" muted>
                Create valid Arabic quiz text, choose a method and select a
                valid hide count first.
              </AppText>
            </View>
          </AppCard>
        )}

        <View style={styles.exportActions}>
          <AppButton
            label="Copy Export JSON"
            disabled={!exportReady}
            onPress={copyExport}
          />

          <AppButton
            label="Share Export JSON"
            variant="secondary"
            disabled={!exportReady}
            onPress={shareExport}
          />
        </View>

        <ExportInfoCard />

        <View style={styles.separator} />

        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitle}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">Import Quiz Draft</AppText>
          </View>
        </View>

        <AppInput
          value={importText}
          onChangeText={setImportText}
          multiline
          maxLength={30000}
          label="Matn Quiz JSON"
          placeholder={`{
  "schema": "matn-quiz-draft",
  "version": 1,
  ...
}`}
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Matn Quiz JSON import"
        />

        <View style={styles.importHelpers}>
          <AppButton
            label="Paste from Clipboard"
            variant="secondary"
            onPress={pasteFromClipboard}
          />

          <AppButton
            label="Load Demo Import"
            variant="ghost"
            onPress={loadDemoImport}
          />

          {importText.length > 0 ? (
            <AppButton
              label="Clear Import"
              variant="ghost"
              onPress={clearImport}
            />
          ) : null}
        </View>

        <TransferStatusBanner
          valid={importResult.valid}
          message={importResult.message}
        />

        {importResult.valid ? (
          <>
            <TransferPreviewCard
              document={importResult.document}
              title="Imported Draft Preview"
            />

            <View style={styles.replaceWarning}>
              <Ionicons
                name="warning-outline"
                size={iconSize.md}
                color={colors.warning}
              />

              <AppText variant="bodySmall" style={styles.replaceWarningText}>
                Applying this import replaces your current quiz draft and clears
                its generated study session.
              </AppText>
            </View>

            <AppButton
              label="Apply Imported Draft"
              size="lg"
              onPress={applyImport}
            />
          </>
        ) : null}

        <AppCard style={styles.formatCard}>
          <View style={styles.formatHeader}>
            <Ionicons
              name="code-slash-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <AppText variant="subheading">Import Validation</AppText>
          </View>

          <AppText variant="bodySmall" muted>
            Matn Quiz checks the schema version, Arabic text, quiz method, hide
            count and available words or lines before replacing your current
            draft.
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: spacing.xxl,
    paddingBottom: spacing.section,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
  },

  introIcon: {
    width: 52,
    height: 52,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  introText: {
    flex: 1,
    gap: spacing.xs,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  sectionTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  exportActions: {
    gap: spacing.md,
  },

  importHelpers: {
    gap: spacing.sm,
  },

  notReadyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },

  notReadyText: {
    flex: 1,
    gap: spacing.xs,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
  },

  actionStatus: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
  },

  successStatus: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  infoStatus: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  actionStatusText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "600",
  },

  replaceWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.lg,
    backgroundColor: colors.warningSoft,
  },

  replaceWarningText: {
    flex: 1,
    color: colors.warning,
    fontWeight: "600",
  },

  formatCard: {
    gap: spacing.md,
  },

  formatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
