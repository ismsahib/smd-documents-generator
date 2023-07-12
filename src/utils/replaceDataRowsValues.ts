import { ImageRun, Paragraph, ParagraphChild, PatchType, TextRun, patchDocument } from "docx";
import { FileChild } from "docx/build/file/file-child";

import { getImage } from "./getImage";

const regex = /https:\/\/lh3\.googleusercontent\.com\//;

const createRowsData = async (rows: string[][]) => {
  const newRows: FileChild[] | ParagraphChild[] = [];
  await Promise.all(
    rows.map(
      async (row) =>
        await Promise.all(
          row.map(async (cell) => {
            if (regex.test(cell)) {
              const { imageArrayBuffer, width, height } = await getImage(cell, true);
              newRows.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageArrayBuffer,
                      transformation: { width: width, height: height },
                    }),
                  ],
                })
              );
            } else
              newRows.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: `${12}pt`,
                      highlight: "yellow",
                    }),
                  ],
                })
              );
          })
        )
    )
  );
  return newRows;
};

export const replaceDataRowsValues = async (
  fileDoc: Blob | ArrayBuffer,
  dataRowsVariables: Record<string, string[][] | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(dataRowsVariables)) {
    if (value) {
      patches[key] = { type: PatchType.DOCUMENT, children: await createRowsData(value) };
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
