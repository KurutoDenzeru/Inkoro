import type { PDFElement } from "@/lib/store";
import { Document, Page, View } from "@/lib/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { Text } from "@/components/pdf/text/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/pdf/table/table";

export type AnnotationKind = PDFElement["type"];

export interface AnnotationReportPage {
  page: number;
  total: number;
  byType: Record<AnnotationKind, number>;
}

export interface AnnotationReportData {
  documentName: string;
  generatedAt: string;
  pageCount: number;
  totalAnnotations: number;
  pages: AnnotationReportPage[];
}

interface AnnotationReportDocumentProps {
  data: AnnotationReportData;
}

type TakumiModule = typeof import("takumi-pdf/no-init");

let takumiModulePromise: Promise<TakumiModule> | undefined;

const createEmptyCounts = (): Record<AnnotationKind, number> => ({
  arrow: 0,
  circle: 0,
  image: 0,
  line: 0,
  rect: 0,
  signature: 0,
  text: 0,
});

const getTakumi = (): Promise<TakumiModule> => {
  if (!takumiModulePromise) {
    takumiModulePromise = Promise.all([
      import("takumi-pdf/no-init"),
      import("takumi-pdf/wasm-url"),
    ]).then(async ([takumi, wasm]) => {
      await takumi.default({ module_or_path: wasm.default });
      return takumi;
    });
  }

  return takumiModulePromise;
};

export function buildAnnotationReportData(
  pdfFile: File | null,
  numPages: number,
  layers: Record<number, PDFElement[]>,
): AnnotationReportData {
  const pageNumbers = new Set<number>();

  for (let page = 1; page <= numPages; page += 1) {
    pageNumbers.add(page);
  }

  for (const page of Object.keys(layers)) {
    const pageNumber = Number(page);
    if (Number.isInteger(pageNumber) && pageNumber > 0) {
      pageNumbers.add(pageNumber);
    }
  }

  const pages = [...pageNumbers]
    .sort((left, right) => left - right)
    .map((page) => {
      const elements = layers[page] ?? [];
      const byType = createEmptyCounts();

      for (const element of elements) {
        byType[element.type] += 1;
      }

      return { page, total: elements.length, byType };
    })
    .filter((page) => page.total > 0);

  return {
    documentName: pdfFile?.name ?? "Untitled document",
    generatedAt: new Date().toISOString(),
    pageCount: numPages,
    totalAnnotations: pages.reduce((total, page) => total + page.total, 0),
    pages,
  };
}

const formatGeneratedAt = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getShapeCount = (counts: Record<AnnotationKind, number>): number =>
  counts.circle + counts.line + counts.rect + counts.arrow;

export function AnnotationReportDocument({ data }: AnnotationReportDocumentProps) {
  const rows = data.pages.length > 0 ? data.pages : [{ page: 1, total: 0, byType: createEmptyCounts() }];

  return (
    <Document title={`Inkoro annotation report — ${data.documentName}`}>
      <Page size="a4">
        <PdfcnThemeProvider>
          <View style={{ gap: 18 }}>
            <Text variant="3xl" weight="bold">
              Inkoro annotation report
            </Text>
            <Text variant="lg" color="#71717a">
              {data.documentName}
            </Text>
            <Text variant="sm" color="#71717a">
              Generated {formatGeneratedAt(data.generatedAt)}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, padding: 12, backgroundColor: "#f4f4f5" }}>
                <Text variant="xs" color="#71717a">
                  Pages
                </Text>
                <Text variant="xl" weight="bold">
                  {data.pageCount}
                </Text>
              </View>
              <View style={{ flex: 1, padding: 12, backgroundColor: "#f4f4f5" }}>
                <Text variant="xs" color="#71717a">
                  Annotations
                </Text>
                <Text variant="xl" weight="bold">
                  {data.totalAnnotations}
                </Text>
              </View>
            </View>

            <Text variant="lg" weight="semibold">
              Annotation distribution
            </Text>
            <Table variant="striped" zebraStripe>
              <TableHeader>
                <TableRow header>
                  <TableCell header>Page</TableCell>
                  <TableCell header>Total</TableCell>
                  <TableCell header>Text</TableCell>
                  <TableCell header>Images</TableCell>
                  <TableCell header>Shapes</TableCell>
                  <TableCell header>Signatures</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell>{row.page}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.byType.text}</TableCell>
                    <TableCell>{row.byType.image}</TableCell>
                    <TableCell>{getShapeCount(row.byType)}</TableCell>
                    <TableCell>{row.byType.signature}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data.pages.length === 0 ? (
              <Text variant="sm" color="#71717a">
                No annotations are currently stored for this document.
              </Text>
            ) : null}
          </View>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

export async function renderAnnotationReport(data: AnnotationReportData): Promise<Uint8Array> {
  const { render } = await getTakumi();

  return render(<AnnotationReportDocument data={data} />, {
    fontFamilies: ["Helvetica", "Times-Roman"],
    margin: { top: 56, right: 48, bottom: 56, left: 48 },
    metadata: {
      creator: "Inkoro",
      title: `Inkoro annotation report — ${data.documentName}`,
    },
    size: "a4",
  });
}
