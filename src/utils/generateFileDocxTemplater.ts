import Docxtemplater from "docxtemplater";

import { getParameters } from "./getParameters";
import { getTable } from "./getTable";
import { getVariablesObject } from "./getVariablesObject";

export const generateFileDocxTemplater = async (
  id: string,
  fileDoc: Docxtemplater<PizZip>,
  text: string
): Promise<Blob> => {
  const table = await getTable(id);
  const parameters = getParameters(text);
  const variables = getVariablesObject(table, parameters);
  fileDoc.setData(variables);
  fileDoc.render();
  const doc = fileDoc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  return doc;
  // const arrayBuffer = await doc.arrayBuffer();
  // const html = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
  // saveAs(doc, "ex.docx");
};
