import type {
  AudioSpeed,
} from "./audio";

export type TtsPrepareRequest = {
  text: string;
  locale: "ar-SA";
  speed: AudioSpeed;
};

export type TtsPreparedAudio = {
  id: string;
  text: string;
  locale: "ar-SA";
  speed: AudioSpeed;
  durationMs: number;
  engine: "MOCK";
};

export interface TtsService {
  prepare(
    request: TtsPrepareRequest,
  ): Promise<TtsPreparedAudio>;
}