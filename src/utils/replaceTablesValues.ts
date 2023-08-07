import { PatchType, TextRun, patchDocument } from "docx";

import { createTable } from "./createDocxTable";

export const replaceTablesValues = async (
  fileDoc: Blob | ArrayBuffer,
  tablesVariables: Record<string, string[][] | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(tablesVariables)) {
    if (value?.length) {
      patches[key] = { type: PatchType.DOCUMENT, children: [await createTable(value, true, true)] };
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
