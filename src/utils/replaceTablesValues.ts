import { ImageRun, Paragraph, PatchType, Table, TableCell, TableRow, TextRun, WidthType, patchDocument } from "docx";

import { getImage } from "./getImage";

const regex = /https:\/\/lh3\.googleusercontent\.com\//;

const createTable = async (rows: string[][]): Promise<Table> => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: await Promise.all(
      rows.map(async (row) => {
        return new TableRow({
          children: await Promise.all(
            row.map(async (cell) => {
              if (regex.test(cell)) {
                const { imageArrayBuffer, width, height } = await getImage(cell, true);
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageArrayBuffer,
                          transformation: { width: width, height: height },
                        }),
                      ],
                    }),
                  ],
                });
              } else
                return new TableCell({
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
                });
            })
          ),
        });
      })
    ),
  });
};

export const replaceTablesValues = async (
  fileDoc: Blob | ArrayBuffer,
  tablesVariables: Record<string, string[][] | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(tablesVariables)) {
    if (value) {
      patches[key] = { type: PatchType.DOCUMENT, children: [await createTable(value)] };
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
