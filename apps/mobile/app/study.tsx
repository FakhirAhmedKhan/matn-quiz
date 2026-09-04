import { FeaturePlaceholderScreen } from "../src/components/navigation";

export default function StudyScreen() {
  return (
    <FeaturePlaceholderScreen
      eyebrow="STUDY"
      title="Study Mode"
      description="Reveal answers, Hide All, Reveal All, progress and demo quiz interactions will be built here."
      nextLabel="Review Quiz"
      nextHref="/review"
    />
  );
}