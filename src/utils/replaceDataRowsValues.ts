import { PatchType, TextRun, patchDocument } from "docx";

import { createTable } from "./createDocxTable";

export const replaceDataRowsValues = async (
  fileDoc: Blob | ArrayBuffer,
  dataRowsVariables: Record<string, string[][] | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(dataRowsVariables)) {
    if (value) {
      patches[key] = { type: PatchType.DOCUMENT, children: [await createTable(value, false, false)] };
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
