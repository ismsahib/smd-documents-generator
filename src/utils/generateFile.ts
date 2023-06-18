/* eslint-disable no-console */
import { PatchType, TextRun, patchDocument } from "docx";
import { saveAs } from "file-saver";

import { getParameters } from "./getParameters";
import { getTable } from "./getTable";
import { getVariablesObject } from "./getVariablesObject";

export const generateFile = async (id: string, fileData: ArrayBuffer, text: string) => {
  const table = await getTable(id);
  const parameters = getParameters(text);
  const variables = getVariablesObject(table, parameters);
  const patches = {};
  for (const [key, value] of Object.entries(variables)) {
    patches[key] = {
      type: PatchType.PARAGRAPH,
      children: value
        .split("#ENTER#")
        .filter((item) => {
          if (item) return true;
          else return false;
        })
        .map((item, index, arr) => new TextRun({ text: item, size: `${12}pt`, break: arr.length > 1 ? 1 : 0 })),
    };
  }
  const doc = await patchDocument(fileData, {
    patches: patches,
  });
  saveAs(new Blob([doc]), "ex.docx");
};
