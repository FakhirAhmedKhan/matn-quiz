import { FeaturePlaceholderScreen } from "../src/components/navigation";

export default function ResumeScreen() {
  return (
    <FeaturePlaceholderScreen
      eyebrow="RESUME"
      title="Resume Study"
      description="This screen will show unfinished quizzes, progress and last activity."
      nextLabel="Resume Demo Quiz"
      nextHref="/study"
    />
  );
}