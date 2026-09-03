import type { BookRepository } from "./book-repository";
import { getBookFeatureConfig } from "./book-config";
import { DemoBookRepository } from "./demo-book-repository";

type BookRepositoryGlobal = typeof globalThis & {
  __matnQuizDemoBookRepository?: DemoBookRepository;
};

const repositoryGlobal = globalThis as BookRepositoryGlobal;

export function getBookRepository(): BookRepository {
  const config = getBookFeatureConfig();

  if (!config.demoMode) {
    throw new Error(
      "BOOKS_DEMO_MODE is disabled, but a Prisma Book repository has not been configured yet.",
    );
  }

  repositoryGlobal.__matnQuizDemoBookRepository ??=
    new DemoBookRepository();

  return repositoryGlobal.__matnQuizDemoBookRepository;
}

export function resetDemoBookRepositoryForTests(): void {
  repositoryGlobal.__matnQuizDemoBookRepository?.clear();
  delete repositoryGlobal.__matnQuizDemoBookRepository;
}