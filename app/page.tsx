"use client";

import { HomePageView } from "@/components/page/home";
import usePage from "@/hooks/usePage";

export default function HomePage() {
  const page = usePage();

  return <HomePageView page={page} />;
}
