import { Paragraph, PatchType, Table, TableCell, TableRow, TextRun, WidthType, patchDocument } from "docx";

const createTable = (rows: string[][]): Table => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows.map((row, index) => {
      if (index === 0)
        return new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell,
                        bold: true,
                        size: `${12}pt`,
                        highlight: "yellow",
                      }),
                    ],
                  }),
                ],
              })
          ),
        });

      return new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: `${12}pt`,
                      highlight: "yellow",
                    }),
                  ],
                }),
              ],
            })
        ),
      });
    }),
  });
};

export const replaceTablesValues = async (
  fileDoc: Blob | ArrayBuffer,
  tablesVariables: Record<string, string[][] | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(tablesVariables)) {
    if (value) {
      patches[key] = { type: PatchType.DOCUMENT, children: [createTable(value)] };
    } else {
      patches[key] = {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      };
    }
  }
  const doc = await patchDocument(fileDoc, { patches: patches });
  return new Blob([doc]);
};
