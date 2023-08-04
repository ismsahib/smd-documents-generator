import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export const replaceTextsValues = (
  fileDoc: ArrayBuffer,
  textsVariables: Record<string, string>,
  delimiters: { start: string; end: string }
): Blob => {
  const docx = new Docxtemplater(new PizZip(fileDoc), {
    delimiters: delimiters,
    paragraphLoop: true,
    linebreaks: true,
  });
  docx.setData(textsVariables);
  docx.render();
  return docx.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
};
