import { Paragraph, PatchType, Table, TableCell, TableRow, TextRun, WidthType, patchDocument } from "docx";

const createTable = (rows: string[][]): Table => {
  return new Table({
    width: {
      size: 10000,
      type: WidthType.DXA,
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
  tablesVariables: Record<string, string[][]>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(tablesVariables)) {
    patches[key] = { type: PatchType.DOCUMENT, children: [createTable(value)] };
  }
  const doc = await patchDocument(fileDoc, { patches: patches });
  return new Blob([doc]);
};
