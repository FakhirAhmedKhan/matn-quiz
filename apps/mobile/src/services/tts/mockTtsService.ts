import type {
  TtsPrepareRequest,
  TtsPreparedAudio,
  TtsService,
} from "../../types/tts";
import {
  estimateMockDurationMs,
} from "../../utils/audio";

class MockTtsService
  implements TtsService {
  async prepare(
    request: TtsPrepareRequest,
  ): Promise<TtsPreparedAudio> {
    await new Promise<void>(
      (resolve) => {
        setTimeout(
          resolve,
          250,
        );
      },
    );

    return {
      id:
        `mock-tts-${Date.now()}`,

      text:
        request.text,

      locale:
        request.locale,

      speed:
        request.speed,

      durationMs:
        estimateMockDurationMs(
          request.text,
          request.speed,
        ),

      engine:
        "MOCK",
    };
  }
}

export const mockTtsService =
  new MockTtsService();