import { PageNumber, TotalPages } from "takumi-pdf/primitives";
import type { PDFElement } from "@/lib/store";
import { Document, Link, Page, View } from "@/lib/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { PdfGraph } from "@/components/pdf/graph/graph";
import type { GraphDataPoint } from "@/components/pdf/graph/graph.types";
import { PdfQRCode } from "@/components/pdf/qrcode/qrcode";
import { Text } from "@/components/pdf/text/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/pdf/table/table";

export type AnnotationKind = PDFElement["type"];
export type AnnotationReportPreset = "standard" | "accessible" | "archival";

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
  sourceFile?: File;
  sourceUrl?: string;
}

export interface AnnotationReportOptions {
  preset?: AnnotationReportPreset;
}

interface AnnotationReportDocumentProps {
  data: AnnotationReportData;
}

type TakumiModule = typeof import("takumi-pdf/no-init");

type ArchivalAttachment = {
  name: string;
  data: string | Uint8Array;
  mimeType: string;
  description: string;
  relationship: "source" | "data" | "alternative" | "supplement" | "unspecified";
  modificationDate: string;
};

let takumiModulePromise: Promise<TakumiModule> | undefined;

const annotationTypeOrder: AnnotationKind[] = [
  "text",
  "image",
  "rect",
  "circle",
  "line",
  "arrow",
  "signature",
];

const annotationTypeLabels: Record<AnnotationKind, string> = {
  arrow: "Arrows",
  circle: "Circles",
  image: "Images",
  line: "Lines",
  rect: "Rectangles",
  signature: "Signatures",
  text: "Text",
};

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
  sourceUrl?: string,
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
    sourceFile: pdfFile ?? undefined,
    sourceUrl,
  };
}

const formatGeneratedAt = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getCreationDate = (value: string): string | undefined => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 19);
};

const getShapeCount = (counts: Record<AnnotationKind, number>): number =>
  counts.circle + counts.line + counts.rect + counts.arrow;

const getTypeTotals = (data: AnnotationReportData): Record<AnnotationKind, number> => {
  const totals = createEmptyCounts();

  for (const page of data.pages) {
    for (const type of annotationTypeOrder) {
      totals[type] += page.byType[type];
    }
  }

  return totals;
};

const getChartData = (data: AnnotationReportData): GraphDataPoint[] => {
  const totals = getTypeTotals(data);
  return annotationTypeOrder
    .filter((type) => totals[type] > 0)
    .map((type) => ({ label: annotationTypeLabels[type], value: totals[type] }));
};

const getChartSummary = (chartData: GraphDataPoint[]): string => {
  if (chartData.length === 0) {
    return "No annotations are available for charting.";
  }

  return `Annotations by type: ${chartData
    .map((point) => `${point.label}, ${point.value}`)
    .join("; ")}.`;
};

const getReportTitle = (data: AnnotationReportData): string =>
  `Inkoro annotation report — ${data.documentName}`;

const getReportRows = (data: AnnotationReportData) =>
  data.pages.length > 0
    ? data.pages
    : [{ page: 1, total: 0, byType: createEmptyCounts() }];

const getQrValue = (data: AnnotationReportData): string =>
  data.sourceUrl ?? "https://inkoro.app";

const ReportHeader = ({ data }: AnnotationReportDocumentProps) => (
  <div
    style={{
      alignItems: "center",
      borderBottom: "1px solid #d4d4d8",
      color: "#52525b",
      display: "flex",
      fontSize: 9,
      justifyContent: "space-between",
      paddingBottom: 6,
      width: "100%",
    }}
  >
    <span>Inkoro annotation report</span>
    <span>{data.documentName}</span>
  </div>
);

const ReportFooter = () => (
  <div
    style={{
      alignItems: "center",
      borderTop: "1px solid #d4d4d8",
      color: "#71717a",
      display: "flex",
      fontSize: 9,
      justifyContent: "space-between",
      paddingTop: 6,
      width: "100%",
    }}
  >
    <span>Generated by Inkoro</span>
    <span>
      Page <PageNumber /> of <TotalPages />
    </span>
  </div>
);

const ReportStats = ({ data }: AnnotationReportDocumentProps) => (
  <View style={{ flexDirection: "row", gap: 12 }}>
    <View style={{ backgroundColor: "#f4f4f5", flex: 1, padding: 12 }}>
      <Text color="#71717a" variant="xs">
        Pages
      </Text>
      <Text variant="xl" weight="bold">
        {data.pageCount}
      </Text>
    </View>
    <View style={{ backgroundColor: "#f4f4f5", flex: 1, padding: 12 }}>
      <Text color="#71717a" variant="xs">
        Annotations
      </Text>
      <Text variant="xl" weight="bold">
        {data.totalAnnotations}
      </Text>
    </View>
  </View>
);

const ReportChart = ({ data }: AnnotationReportDocumentProps) => {
  const chartData = getChartData(data);
  const chartSummary = getChartSummary(chartData);

  return (
    <View style={{ gap: 6 }}>
      {chartData.length > 0 ? (
        <PdfGraph
          alt={chartSummary}
          data={chartData}
          height={180}
          legend="none"
          noWrap
          showValues
          variant="horizontal-bar"
          width={440}
        />
      ) : (
        <Text color="#71717a" variant="sm">
          No annotations are available for charting.
        </Text>
      )}
    </View>
  );
};

const ReportSessionLink = ({ data }: AnnotationReportDocumentProps) => (
  <View style={{ alignItems: "center", flexDirection: "row", gap: 16 }}>
    <PdfQRCode
      alt="QR code linking to the current Inkoro session"
      caption="Open this session"
      size={96}
      value={getQrValue(data)}
    />
    <View style={{ flex: 1, gap: 6 }}>
      <Text color="#71717a" variant="xs">
        Session link
      </Text>
      {data.sourceUrl ? (
        <Link
          src={data.sourceUrl}
          style={{ color: "#2563eb", fontSize: 10, textDecoration: "underline" }}
        >
          Open this annotation session in Inkoro
        </Link>
      ) : (
        <Text color="#71717a" variant="sm">
          No session URL is available.
        </Text>
      )}
    </View>
  </View>
);

const ReportTable = ({ data }: AnnotationReportDocumentProps) => (
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
      {getReportRows(data).map((row) => (
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
);

function AnnotationReportDocument({ data }: AnnotationReportDocumentProps) {
  return (
    <Document title={getReportTitle(data)}>
      <Page size="a4">
        <PdfcnThemeProvider>
          <View style={{ gap: 18 }}>
            <h1 style={{ margin: 0 }}>
              <Text variant="3xl" weight="bold">
                Inkoro annotation report
              </Text>
            </h1>
            <Text color="#71717a" variant="lg">
              {data.documentName}
            </Text>
            <Text color="#71717a" variant="sm">
              Generated {formatGeneratedAt(data.generatedAt)}
            </Text>

            <h2 style={{ margin: 0 }}>
              <Text variant="lg" weight="semibold">
                Overview
              </Text>
            </h2>
            <ReportStats data={data} />

            <h2 style={{ margin: 0 }}>
              <Text variant="lg" weight="semibold">
                Annotation distribution
              </Text>
            </h2>
            <ReportChart data={data} />

            <h2 style={{ margin: 0 }}>
              <Text variant="lg" weight="semibold">
                Page details
              </Text>
            </h2>
            <ReportTable data={data} />
            {data.pages.length === 0 ? (
              <Text color="#71717a" variant="sm">
                No annotations are currently stored for this document.
              </Text>
            ) : null}

            <h2 style={{ margin: 0 }}>
              <Text variant="lg" weight="semibold">
                Session reference
              </Text>
            </h2>
            <ReportSessionLink data={data} />
          </View>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

const accessibleTextStyle = {
  color: "#27272a",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: 10,
  lineHeight: 1.4,
  margin: 0,
};

const accessibleTableCellStyle = {
  borderBottom: "1px solid #d4d4d8",
  padding: 6,
  textAlign: "left" as const,
};

function AccessibleAnnotationReportDocument({
  data,
}: AnnotationReportDocumentProps) {
  const chartData = getChartData(data);
  const chartSummary = getChartSummary(chartData);

  return (
    <Document title={getReportTitle(data)}>
      <Page size="a4">
        <PdfcnThemeProvider>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h1 style={{ fontSize: 28, margin: 0 }}>Inkoro annotation report</h1>
            <p style={{ ...accessibleTextStyle, fontSize: 14 }}>
              {data.documentName}
            </p>
            <p style={accessibleTextStyle}>
              Generated {formatGeneratedAt(data.generatedAt)}
            </p>

            <h2 style={{ fontSize: 16, margin: 0 }}>Overview</h2>
            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
              <div style={{ backgroundColor: "#f4f4f5", flex: 1, padding: 12 }}>
                <p style={{ ...accessibleTextStyle, fontSize: 9 }}>Pages</p>
                <p style={{ ...accessibleTextStyle, fontSize: 20 }}>{data.pageCount}</p>
              </div>
              <div style={{ backgroundColor: "#f4f4f5", flex: 1, padding: 12 }}>
                <p style={{ ...accessibleTextStyle, fontSize: 9 }}>Annotations</p>
                <p style={{ ...accessibleTextStyle, fontSize: 20 }}>
                  {data.totalAnnotations}
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: 16, margin: 0 }}>Annotation distribution</h2>
            <figure aria-label={chartSummary} style={{ margin: 0 }}>
              {chartData.length > 0 ? (
                <PdfGraph
                  data={chartData}
                  height={180}
                  legend="none"
                  noWrap
                  showValues
                  variant="horizontal-bar"
                  width={440}
                />
              ) : (
                <p style={accessibleTextStyle}>{chartSummary}</p>
              )}
              <figcaption style={{ ...accessibleTextStyle, fontSize: 9, marginTop: 6 }}>
                {chartSummary}
              </figcaption>
            </figure>

            <h2 style={{ fontSize: 16, margin: 0 }}>Page details</h2>
            <table
              style={{
                borderCollapse: "collapse",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 9,
                width: "100%",
              }}
            >
              <caption style={{ ...accessibleTextStyle, fontWeight: "bold", textAlign: "left" }}>
                Annotation counts by page
              </caption>
              <thead>
                <tr>
                  {(["Page", "Total", "Text", "Images", "Shapes", "Signatures"] as const).map(
                    (label) => (
                      <th key={label} scope="col" style={accessibleTableCellStyle}>
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {getReportRows(data).map((row) => (
                  <tr key={row.page}>
                    <td style={accessibleTableCellStyle}>{row.page}</td>
                    <td style={accessibleTableCellStyle}>{row.total}</td>
                    <td style={accessibleTableCellStyle}>{row.byType.text}</td>
                    <td style={accessibleTableCellStyle}>{row.byType.image}</td>
                    <td style={accessibleTableCellStyle}>{getShapeCount(row.byType)}</td>
                    <td style={accessibleTableCellStyle}>{row.byType.signature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.pages.length === 0 ? (
              <p style={accessibleTextStyle}>
                No annotations are currently stored for this document.
              </p>
            ) : null}

            <h2 style={{ fontSize: 16, margin: 0 }}>Session reference</h2>
            <figure aria-label="QR code linking to the current Inkoro session" style={{ margin: 0 }}>
              <PdfQRCode
                caption="Scan to open this annotation session in Inkoro"
                size={96}
                value={getQrValue(data)}
              />
              {data.sourceUrl ? (
                <p style={{ ...accessibleTextStyle, fontSize: 9, marginTop: 6 }}>
                  <a href={data.sourceUrl}>Open this annotation session in Inkoro</a>
                </p>
              ) : null}
            </figure>
          </div>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}

const getArchivalAttachments = async (
  data: AnnotationReportData,
): Promise<ArchivalAttachment[]> => {
  const modificationDate = getCreationDate(data.generatedAt) ?? data.generatedAt;
  const attachments: ArchivalAttachment[] = [
    {
      data: JSON.stringify(
        {
          documentName: data.documentName,
          generatedAt: data.generatedAt,
          pageCount: data.pageCount,
          pages: data.pages,
          totalAnnotations: data.totalAnnotations,
        },
        null,
        2,
      ),
      description: "Inkoro annotation report source data",
      mimeType: "application/json",
      modificationDate,
      name: "inkoro-annotation-report.json",
      relationship: "data",
    },
  ];

  if (data.sourceFile) {
    attachments.push({
      data: new Uint8Array(await data.sourceFile.arrayBuffer()),
      description: "Original PDF document used for this annotation session",
      mimeType: data.sourceFile.type || "application/pdf",
      modificationDate,
      name: data.sourceFile.name || "source.pdf",
      relationship: "source",
    });
  }

  return attachments;
};

export async function renderAnnotationReport(
  data: AnnotationReportData,
  options: AnnotationReportOptions = {},
): Promise<Uint8Array> {
  const { render } = await getTakumi();
  const preset = options.preset ?? "standard";
  const metadata = {
    authors: ["Inkoro"],
    creator: "Inkoro",
    description: "Annotation summary generated from an Inkoro editing session.",
    keywords: ["Inkoro", "annotations", "PDF report"],
    title: getReportTitle(data),
    creationDate: getCreationDate(data.generatedAt),
  };
  const baseOptions = {
    fontFamilies: ["Helvetica", "Arial", "sans-serif"],
    footer: <ReportFooter />,
    header: <ReportHeader data={data} />,
    lang: "en",
    margin: { top: 60, right: 48, bottom: 60, left: 48 },
    metadata,
    outline: true,
    size: "a4" as const,
  };

  if (preset === "accessible") {
    return render(<AccessibleAnnotationReportDocument data={data} />, {
      ...baseOptions,
      tagged: "ua1",
    });
  }

  if (preset === "archival") {
    return render(<AnnotationReportDocument data={data} />, {
      ...baseOptions,
      attachments: await getArchivalAttachments(data),
      pdfa: "3b",
      tagged: true,
    });
  }

  return render(<AnnotationReportDocument data={data} />, {
    ...baseOptions,
    tagged: true,
  });
}
