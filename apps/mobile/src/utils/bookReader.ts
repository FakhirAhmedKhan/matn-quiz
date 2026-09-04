import type {
  Book,
} from "../types/book";

export type BookReaderMode =
  | "READING"
  | "FOCUS";

export type BookReaderFontSize =
  | "SMALL"
  | "MEDIUM"
  | "LARGE";

export type DemoBookPage = {
  pageNumber: number;
  heading: string;
  arabicText: string;
  note: string;
};

const DEMO_PARAGRAPHS = [
  `العلم النافع نور للقلب، وبالقراءة والتأمل يزداد الفهم رسوخا في النفس. ومن أحسن طرق التعلم أن يقرأ الطالب بتأن ثم يعيد المعنى بلسانه ويكتب أهم الفوائد.`,

  `ينبغي لطالب العلم أن يجمع بين الفهم والمراجعة، فلا تكون القراءة سريعة بلا تدبر، ولا تكون المراجعة متباعدة حتى ينسى ما سبق. والاستمرار القليل خير من الانقطاع الطويل.`,

  `المقصود من هذا النص التجريبي هو اختبار تجربة القراءة داخل تطبيق متن كويز. يمكن للقارئ الانتقال بين الصفحات وتغيير حجم الخط وحفظ موضع القراءة تلقائيا.`,

  `عند قراءة النص العربي يستحسن التركيز على جملة واحدة في كل مرة، ثم الانتقال إلى الجملة التالية بعد فهم معناها. وهذه الطريقة نافعة في القراءة والحفظ والمراجعة.`,

  `المراجعة المنظمة تساعد على تثبيت المعلومات. اقرأ الصفحة، ثم أغلق النص للحظات وحاول استرجاع أهم الأفكار، وبعد ذلك عد إلى الصفحة وقارن ما تذكرته بما قرأت.`,

  `القراءة ليست مجرد انتقال بين الكلمات، وإنما هي فهم وترابط واستحضار. ولهذا صممت واجهة القارئ لتكون بسيطة ومريحة وتقلل المشتتات أثناء جلسة الدراسة.`,
];

const DEMO_HEADINGS = [
  "صفحة للقراءة والتأمل",
  "المراجعة والاستمرار",
  "تجربة القارئ",
  "طريقة القراءة",
  "تثبيت المعلومات",
  "التركيز أثناء الدراسة",
];

export function clampBookPage(
  page: number,
  totalPages: number,
): number {
  const total =
    Math.max(
      1,
      Math.floor(totalPages),
    );

  if (
    !Number.isFinite(page)
  ) {
    return 1;
  }

  return Math.min(
    total,
    Math.max(
      1,
      Math.floor(page),
    ),
  );
}

export function getInitialReaderPage(
  book: Book,
): number {
  if (
    book.currentPage >=
    book.totalPages
  ) {
    return 1;
  }

  if (
    book.currentPage <= 0
  ) {
    return 1;
  }

  return clampBookPage(
    book.currentPage,
    book.totalPages,
  );
}

export function getBookPageProgress(
  page: number,
  totalPages: number,
): number {
  const safePage =
    clampBookPage(
      page,
      totalPages,
    );

  const total =
    Math.max(
      1,
      totalPages,
    );

  return Math.min(
    1,
    Math.max(
      0,
      safePage / total,
    ),
  );
}

export function getBookPagePercentage(
  page: number,
  totalPages: number,
): number {
  return Math.round(
    getBookPageProgress(
      page,
      totalPages,
    ) * 100,
  );
}

export function getReaderFontStyle(
  size: BookReaderFontSize,
): {
  fontSize: number;
  lineHeight: number;
} {
  switch (size) {
    case "SMALL":
      return {
        fontSize: 22,
        lineHeight: 40,
      };

    case "LARGE":
      return {
        fontSize: 34,
        lineHeight: 58,
      };

    default:
      return {
        fontSize: 28,
        lineHeight: 48,
      };
  }
}

export function createDemoBookPage(
  book: Book,
  pageNumber: number,
): DemoBookPage {
  const page =
    clampBookPage(
      pageNumber,
      book.totalPages,
    );

  const contentIndex =
    (page - 1) %
    DEMO_PARAGRAPHS.length;

  const secondaryIndex =
    page %
    DEMO_PARAGRAPHS.length;

  return {
    pageNumber:
      page,

    heading:
      DEMO_HEADINGS[
        contentIndex
      ],

    arabicText:
      `${DEMO_PARAGRAPHS[contentIndex]}

${DEMO_PARAGRAPHS[secondaryIndex]}`,

    note:
      `Demo reader content for ${book.title}. This is UI demonstration text and is not presented as the original text of the book.`,
  };
}