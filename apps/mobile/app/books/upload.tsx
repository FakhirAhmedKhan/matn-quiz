import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

import {
  BookImportCategoryPicker,
  BookImportPreviewCard,
  BookImportStatusCard,
  SelectedBookFileCard,
  type BookImportStatus,
} from "../../src/components/book-import";
import { AppHeader, AppScreen } from "../../src/components/layout";
import { AppButton, AppCard, AppInput, AppText } from "../../src/components/ui";
import { useBookStore } from "../../src/store/bookStore";
import type { BookCategory, BookFileMetadata } from "../../src/types/book";
import {
  buildImportedBookInput,
  validateImportedBookInput,
} from "../../src/utils/bookImport";
import { colors, iconSize, radius, spacing, typography } from "../../src/theme";

export default function BookUploadScreen() {
  const addImportedBook = useBookStore((state) => state.addImportedBook);

  const [title, setTitle] = useState("");

  const [arabicTitle, setArabicTitle] = useState("");

  const [author, setAuthor] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<BookCategory>("ARABIC");

  const [pagesText, setPagesText] = useState("100");

  const [file, setFile] = useState<BookFileMetadata | null>(null);

  const [importStatus, setImportStatus] = useState<BookImportStatus>("IDLE");

  const [statusMessage, setStatusMessage] = useState("");

  const totalPages = Number.parseInt(pagesText, 10);

  const validation = validateImportedBookInput({
    title,
    author,
    description,
    category,
    totalPages: Number.isFinite(totalPages) ? totalPages : 0,
    file,
  });

  const processing = importStatus === "PROCESSING";

  async function choosePdf() {
    if (processing) {
      return;
    }

    try {
      setImportStatus("IDLE");

      setStatusMessage("");

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",

        copyToCacheDirectory: true,

        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];

      const selectedFile: BookFileMetadata = {
        fileName: asset.name,

        fileUri: asset.uri,

        mimeType: asset.mimeType ?? null,

        sizeBytes: typeof asset.size === "number" ? asset.size : null,
      };

      setFile(selectedFile);
    } catch {
      setImportStatus("ERROR");

      setStatusMessage("The document picker could not open. Please try again.");
    }
  }

  function removeFile() {
    if (processing) {
      return;
    }

    setFile(null);

    setImportStatus("IDLE");

    setStatusMessage("");
  }

  function loadDemoMetadata() {
    if (processing) {
      return;
    }

    setTitle("My Arabic Study Book");

    setArabicTitle("كتاب الدراسة العربية");

    setAuthor("Local PDF Import");

    setDescription(
      "A locally selected Arabic study document imported into the Matn Quiz demo library.",
    );

    setCategory("ARABIC");

    setPagesText("120");
  }

  async function importBook() {
    if (processing || !validation.valid || !file) {
      return;
    }

    setImportStatus("PROCESSING");

    setStatusMessage(
      "Processing PDF metadata and preparing the local library entry...",
    );

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 900);
    });

    const importedBook = addImportedBook(
      buildImportedBookInput({
        title,
        arabicTitle,
        author,
        description,
        category,
        totalPages,
        file,
      }),
    );

    setImportStatus("SUCCESS");

    setStatusMessage("Book imported successfully.");

    router.replace({
      pathname: "/books/[bookId]",

      params: {
        bookId: importedBook.id,
      },
    });
  }

  return (
    <AppScreen>
      <View style={styles.page}>
        <AppHeader
          title="Import Book"
          subtitle="Add a local PDF"
          showBack
          onBack={() => router.back()}
        />

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="cloud-upload-outline"
              size={iconSize.lg}
              color={colors.primary}
            />
          </View>

          <View style={styles.introText}>
            <AppText variant="title">Add PDF to Library</AppText>

            <AppText muted>
              Select a PDF, add its metadata and create a local demo-library
              entry.
            </AppText>
          </View>
        </View>

        <AppCard style={styles.fileSection}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="document-attach-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.sectionHeadingText}>
              <AppText variant="subheading">1. Select PDF</AppText>

              <AppText variant="caption" muted>
                PDF only · Maximum 25 MB
              </AppText>
            </View>
          </View>

          {!file ? (
            <View style={styles.uploadArea}>
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={iconSize.xl}
                  color={colors.primary}
                />
              </View>

              <AppText variant="subheading" align="center">
                Choose a PDF Document
              </AppText>

              <AppText variant="bodySmall" muted align="center">
                The file picker uses Expo's local document picker. M18 stores
                only demo metadata and the local file reference.
              </AppText>

              <AppButton
                label="Choose PDF"
                disabled={processing}
                onPress={choosePdf}
              />
            </View>
          ) : (
            <SelectedBookFileCard file={file} onRemove={removeFile} />
          )}
        </AppCard>

        <AppCard style={styles.metadataCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="create-outline"
              size={iconSize.md}
              color={colors.primary}
            />

            <View style={styles.sectionHeadingText}>
              <AppText variant="subheading">2. Book Metadata</AppText>

              <AppText variant="caption" muted>
                Used in your Books library
              </AppText>
            </View>
          </View>

          <AppInput
            value={title}
            onChangeText={setTitle}
            label="Book Title"
            placeholder="e.g. Arabic Grammar Notes"
            maxLength={160}
            autoCorrect={false}
            accessibilityLabel="Book title"
          />

          <AppInput
            value={arabicTitle}
            onChangeText={setArabicTitle}
            arabic
            label="Arabic Title (Optional)"
            placeholder="عنوان الكتاب"
            maxLength={160}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Arabic book title"
          />

          <AppInput
            value={author}
            onChangeText={setAuthor}
            label="Author / Source"
            placeholder="Author or source name"
            maxLength={160}
            autoCorrect={false}
            accessibilityLabel="Book author"
          />

          <AppInput
            value={description}
            onChangeText={setDescription}
            label="Description (Optional)"
            placeholder="Short description of this book"
            multiline
            maxLength={1000}
            accessibilityLabel="Book description"
          />

          <View style={styles.pageField}>
            <AppText variant="bodySmall" style={styles.fieldLabel}>
              Estimated Total Pages
            </AppText>

            <TextInput
              value={pagesText}
              onChangeText={(value) =>
                setPagesText(value.replace(/[^0-9]/g, ""))
              }
              keyboardType="number-pad"
              maxLength={4}
              placeholder="100"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Estimated total pages"
              style={styles.pageInput}
            />

            <AppText variant="caption" muted>
              Demo range: 1 to 5000 pages.
            </AppText>
          </View>

          <View style={styles.categorySection}>
            <AppText variant="bodySmall" style={styles.fieldLabel}>
              Category
            </AppText>

            <BookImportCategoryPicker value={category} onChange={setCategory} />
          </View>

          <AppButton
            label="Load Demo Metadata"
            variant="ghost"
            disabled={processing}
            onPress={loadDemoMetadata}
          />
        </AppCard>

        <BookImportPreviewCard
          title={title}
          arabicTitle={arabicTitle}
          author={author}
          description={description}
          category={category}
          totalPages={Number.isFinite(totalPages) ? totalPages : 0}
          file={file}
        />

        <View
          style={[
            styles.validation,
            validation.valid ? styles.valid : styles.invalid,
          ]}
        >
          <Ionicons
            name={
              validation.valid
                ? "checkmark-circle-outline"
                : "information-circle-outline"
            }
            size={iconSize.md}
            color={validation.valid ? colors.success : colors.warning}
          />

          <AppText
            variant="bodySmall"
            style={[
              styles.validationText,
              validation.valid ? styles.validText : styles.invalidText,
            ]}
          >
            {validation.message}
          </AppText>
        </View>

        <BookImportStatusCard status={importStatus} message={statusMessage} />

        <View style={styles.actions}>
          <AppButton
            label={processing ? "Processing PDF..." : "Import Book to Library"}
            size="lg"
            disabled={!validation.valid || processing}
            onPress={importBook}
          />

          <AppButton
            label="Cancel Import"
            variant="ghost"
            disabled={processing}
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.mockNotice}>
          <Ionicons
            name="flask-outline"
            size={iconSize.md}
            color={colors.primary}
          />

          <AppText variant="bodySmall" style={styles.mockNoticeText}>
            M18 is the local PDF import foundation. It validates and stores the
            selected file reference plus metadata, but does not yet extract or
            render the real PDF pages. Existing M17 reader content remains demo
            content.
          </AppText>
        </View>
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

  fileSection: {
    gap: spacing.lg,
  },

  metadataCard: {
    gap: spacing.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sectionHeadingText: {
    flex: 1,
    gap: spacing.xs,
  },

  uploadArea: {
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSoft,
  },

  uploadIcon: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySoft,
  },

  pageField: {
    gap: spacing.sm,
  },

  fieldLabel: {
    color: colors.primaryDark,
    fontWeight: "700",
  },

  pageInput: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: typography.body,
  },

  categorySection: {
    gap: spacing.sm,
  },

  validation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
  },

  valid: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },

  invalid: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },

  validationText: {
    flex: 1,
    fontWeight: "600",
  },

  validText: {
    color: colors.success,
  },

  invalidText: {
    color: colors.warning,
  },

  actions: {
    gap: spacing.md,
  },

  mockNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },

  mockNoticeText: {
    flex: 1,
    color: colors.primaryDark,
  },
});
