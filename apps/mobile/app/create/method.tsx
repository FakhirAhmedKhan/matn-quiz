import { FeaturePlaceholderScreen } from "../../src/components/navigation";

export default function CreateMethodScreen() {
  return (
    <FeaturePlaceholderScreen
      eyebrow="STEP 2 OF 3"
      title="Choose Quiz Method"
      description="Hide Words and Hide Lines selection will be implemented in the quiz-method phase."
      nextLabel="Continue to Hide Count"
      nextHref="/create/count"
    />
  );
}