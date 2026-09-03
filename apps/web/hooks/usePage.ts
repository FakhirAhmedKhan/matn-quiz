"use client";

import { DEFAULT_QUIZ_METHOD, HIDE_COUNT_DEFAULT, QUIZ_METHOD_OPTIONS } from '@/lib/constants/quiz';
import { safeGenerateQuiz } from '@/lib/quiz/generate-quiz';
import { isValidHideCount, normalizeHideCount } from '@/lib/quiz/hide-count';
import type { SavedQuizRecord } from '@/lib/quiz/quiz-history';
import { loadSavedQuizHistory, saveQuizToHistory, deleteSavedQuizFromHistory, clearQuizHistoryStorage } from '@/lib/quiz/quiz-history-repository';
import type { QuizReviewState } from '@/lib/quiz/review-session';
import type { ShareableQuizDocument } from '@/lib/quiz/shareable-quiz';
import type { QuizStudyState } from '@/lib/quiz/study-session';
import type { PersistedStudySessionDocument } from '@/lib/quiz/study-session-persistence';
import { loadPersistedStudySession, clearPersistedStudySession } from '@/lib/quiz/study-session-repository';
import { validateQuranTextInput, getQuranTextInputError } from '@/lib/quiz/validation';
import { getArabicTextStats } from '@/lib/utils/arabic';
import type { QuizMethod, GeneratedQuiz } from '@/types/quiz';
import { useEffect, useMemo, useState } from 'react'

const usePage = () => {
    const [quranText, setQuranText] = useState("");
    const [quizMethod, setQuizMethod] =
        useState<QuizMethod>(DEFAULT_QUIZ_METHOD);
    const [hideCount, setHideCount] = useState(HIDE_COUNT_DEFAULT);
    const [generatedQuiz, setGeneratedQuiz] =
        useState<GeneratedQuiz | null>(null);
    const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizRecord[]>([]);
    const [persistedStudySession, setPersistedStudySession] =
        useState<PersistedStudySessionDocument | null>(null);
    const [resumeStudyState, setResumeStudyState] =
        useState<QuizStudyState | undefined>();
    const [resumeReviewState, setResumeReviewState] =
        useState<QuizReviewState | undefined>();
    const [resumeSessionId, setResumeSessionId] = useState<string | undefined>();
    const [generateError, setGenerateError] = useState<string | undefined>();
    const [historyStatus, setHistoryStatus] = useState<string | undefined>();

    const stats = useMemo(() => getArabicTextStats(quranText), [quranText]);

    const validation = useMemo(
        () => validateQuranTextInput(quranText),
        [quranText],
    );

    const hideCountValid = useMemo(
        () => isValidHideCount(hideCount, quranText, quizMethod),
        [hideCount, quranText, quizMethod],
    );

    const selectedMethod = QUIZ_METHOD_OPTIONS.find(
        (method) => method.value === quizMethod,
    );

    const error =
        quranText.trim().length > 0
            ? getQuranTextInputError(quranText)
            : undefined;

    const canGenerate = validation.valid && hideCountValid;

    const refreshSavedQuizzes = () => {
        setSavedQuizzes(loadSavedQuizHistory());
    };

    const refreshPersistedStudySession = () => {
        setPersistedStudySession(loadPersistedStudySession());
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshSavedQuizzes();
        refreshPersistedStudySession();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHideCount((current) =>
            normalizeHideCount(current, quranText, quizMethod),
        );
    }, [quranText, quizMethod]);

    const clearResumeState = () => {
        setResumeStudyState(undefined);
        setResumeReviewState(undefined);
        setResumeSessionId(undefined);
    };

    const handleTextChange = (value: string) => {
        setQuranText(value);
        setGeneratedQuiz(null);
        setGenerateError(undefined);
        setHistoryStatus(undefined);
        clearResumeState();
    };

    const handleMethodChange = (value: QuizMethod) => {
        setQuizMethod(value);
        setGeneratedQuiz(null);
        setGenerateError(undefined);
        setHistoryStatus(undefined);
        clearResumeState();
    };

    const handleHideCountChange = (value: number) => {
        setHideCount(normalizeHideCount(value, quranText, quizMethod));
        setGeneratedQuiz(null);
        setGenerateError(undefined);
        setHistoryStatus(undefined);
        clearResumeState();
    };

    const handleGenerate = () => {
        const result = safeGenerateQuiz({
            text: quranText,
            method: quizMethod,
            hideCount,
        });

        if (!result.ok) {
            setGeneratedQuiz(null);
            setGenerateError(result.errors[0]?.message ?? "Unable to generate quiz.");
            return;
        }

        setGeneratedQuiz(result.quiz);
        setGenerateError(undefined);
        setHistoryStatus(undefined);
        setPersistedStudySession(null);
        clearResumeState();
    };

    const handleSaveQuiz = () => {
        if (!generatedQuiz) {
            setHistoryStatus("Generate a quiz before saving.");
            return;
        }

        const saved = saveQuizToHistory(generatedQuiz);

        if (!saved) {
            setHistoryStatus("Unable to save quiz in this browser.");
            return;
        }

        refreshSavedQuizzes();
        setHistoryStatus("Quiz saved to history.");
    };

    const openQuizPayload = (
        quiz: GeneratedQuiz,
        statusMessage: string,
    ) => {
        setQuranText(quiz.originalText);
        setQuizMethod(quiz.method);
        setHideCount(
            normalizeHideCount(quiz.requestedCount, quiz.originalText, quiz.method),
        );
        setGeneratedQuiz(quiz);
        setGenerateError(undefined);
        setHistoryStatus(statusMessage);
    };

    const handleOpenSavedQuiz = (record: SavedQuizRecord) => {
        clearResumeState();
        openQuizPayload(record.quiz, "Saved quiz opened.");
    };

    const handleImportShareableQuiz = (
        quiz: GeneratedQuiz,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _document: ShareableQuizDocument,
    ) => {
        clearResumeState();
        openQuizPayload(quiz, "Imported quiz opened.");
    };

    const handleResumeStudySession = (document: PersistedStudySessionDocument) => {
        const quiz = document.studyState.quiz;

        setResumeStudyState(document.studyState);
        setResumeReviewState(document.reviewState);
        setResumeSessionId(document.sessionId);
        openQuizPayload(quiz, "Study session resumed.");
    };

    const handleClearStudySession = () => {
        const cleared = clearPersistedStudySession();

        if (!cleared) {
            setHistoryStatus("Unable to clear study session.");
            return;
        }

        setPersistedStudySession(null);
        clearResumeState();
        setHistoryStatus("Study session cleared.");
    };

    const handleDeleteSavedQuiz = (id: string) => {
        const deleted = deleteSavedQuizFromHistory(id);

        if (!deleted) {
            setHistoryStatus("Unable to delete saved quiz.");
            return;
        }

        refreshSavedQuizzes();
        setHistoryStatus("Saved quiz deleted.");
    };

    const handleClearHistory = () => {
        const cleared = clearQuizHistoryStorage();

        if (!cleared) {
            setHistoryStatus("Unable to clear saved history.");
            return;
        }

        setSavedQuizzes([]);
        setHistoryStatus("Saved history cleared.");
    };

    const usePageState = {
        handleTextChange,
        handleMethodChange,
        handleHideCountChange,
        handleGenerate,
        handleSaveQuiz,
        handleOpenSavedQuiz,
        handleImportShareableQuiz,
        handleResumeStudySession,
        handleClearStudySession,
        handleDeleteSavedQuiz,
        handleClearHistory,
        setPersistedStudySession,
        setGeneratedQuiz,
        setResumeStudyState,
        setResumeReviewState,
        setResumeSessionId,
        clearResumeState,
        quranText,
        quizMethod,
        hideCount,
        generatedQuiz,
        savedQuizzes,
        persistedStudySession,
        resumeStudyState,
        resumeReviewState,
        resumeSessionId,
        generateError,
        historyStatus,
        stats,
        validation,
        hideCountValid,
        selectedMethod,
        error,
        canGenerate
    };

    return usePageState;
}

export default usePage
