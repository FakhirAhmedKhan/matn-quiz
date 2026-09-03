import { NextResponse } from "next/server";
import {
  AZURE_TTS_OUTPUT_FORMAT,
  AzureSpeechConfigError,
  AzureSpeechRequestError,
  getAzureSpeechConfig,
  synthesizeAzureSpeech,
} from "@/lib/tts/azure-speech";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TTS_TEXT_LENGTH = 3000;
const PLACEHOLDER_PATTERN = /_{2,}|□{2,}/u;

interface TtsRequestBody {
  text?: unknown;
}

function jsonError(error: string, status: number, code: string) {
  return NextResponse.json({ error, code }, { status });
}

async function readRequestBody(request: Request): Promise<TtsRequestBody | null> {
  try {
    return (await request.json()) as TtsRequestBody;
  } catch {
    return null;
  }
}

export async function GET() {
  const config = getAzureSpeechConfig();

  return NextResponse.json({
    provider: "azure",
    configured: config.configured,
    voice: config.voice,
    region: config.region || null,
    outputFormat: AZURE_TTS_OUTPUT_FORMAT,
  });
}

export async function POST(request: Request) {
  const body = await readRequestBody(request);

  if (!body || typeof body.text !== "string") {
    return jsonError("Text is required.", 400, "TTS_TEXT_REQUIRED");
  }

  const text = body.text.trim();

  if (!text) {
    return jsonError("Text is required.", 400, "TTS_TEXT_REQUIRED");
  }

  if (text.length > MAX_TTS_TEXT_LENGTH) {
    return jsonError("Text is too long.", 400, "TTS_TEXT_TOO_LONG");
  }

  if (PLACEHOLDER_PATTERN.test(text)) {
    return jsonError(
      "Speakable text cannot contain hidden-answer placeholders.",
      400,
      "TTS_PLACEHOLDER_BLOCKED",
    );
  }

  try {
    const audio = await synthesizeAzureSpeech(text);

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof AzureSpeechConfigError) {
      return jsonError(error.message, 503, error.code);
    }

    if (error instanceof AzureSpeechRequestError) {
      return jsonError(error.message, 502, "AZURE_TTS_REQUEST_FAILED");
    }

    return jsonError("Unable to create Arabic audio.", 500, "TTS_UNKNOWN_ERROR");
  }
}
