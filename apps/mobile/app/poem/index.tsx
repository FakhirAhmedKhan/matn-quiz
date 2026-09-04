import { FeaturePlaceholderScreen } from "../../src/components/navigation";

export default function PoemScreen() {
  return (
    <FeaturePlaceholderScreen
      eyebrow="POEM"
      title="Poem Setup"
      description="Arabic poem title/text input will be implemented here."
      nextLabel="Open Poem Reader"
      nextHref="/poem/read"
    />
  );
}