import { getRows } from "./getRows";

const regexTextParameter = /{<([\w\d-]+)>}/;
const regexTextReserveParameter = /{&lt;([\w\d-]+)&gt;}/;
const regexImportTextParameter = /{<([\w\d-]+@import\((\d+),(\d+)\))>}/;
const regexDocxParameter = /{{([\w\d-]+)}}/;
const regexImportDocxParameter = /{{([\w\d-]+@import\((\d+),(\d+)\))}}/;
const regexImageSrc = /src="(.*?)"/;

// учесть параметры с @import

export const getVariablesObject = (
  table: HTMLTableElement,
  parameters: {
    texts: Set<string> | undefined;
    images: Set<string> | undefined;
    tables: Set<string> | undefined;
    dataRows: Set<string> | undefined;
  }
): {
  texts: Record<string, string> | undefined;
  images: Record<string, string | undefined> | undefined;
  tables: Record<string, string[][] | undefined> | undefined;
  dataRows: Record<string, string[][] | undefined> | undefined;
} => {
  const texts: { [a: string]: string } = {};
  const images: { [a: string]: string | undefined } = {};
  const tables: { [a: string]: string[][] | undefined } = {};
  const dataRows: { [a: string]: string[][] | undefined } = {};

  const maxRows = table.tBodies[0].rows.length;
  const maxCells = table.rows[0].cells.length - 1;

  if (parameters.texts) {
    parameters.texts.forEach((parameter) => {
      const key = ((parameter.match(regexTextParameter) as RegExpMatchArray) ||
        (parameter.match(regexImportTextParameter) as RegExpMatchArray) ||
        (parameter.match(regexTextReserveParameter) as RegExpMatchArray))[1];
      const keyArray = key.split("@import")[0].split("-");
      const cell = keyArray[1];
      const row = keyArray[2];
      if (Number(cell) > 0 && Number(cell) <= maxCells && Number(row) > 0 && Number(row) <= maxRows) {
        const value = (table.rows[row].cells[cell].innerHTML as string)
          .replaceAll("<br>", "\n")
          .replaceAll(/<[^>]+>/g, "")
          .split("\n")
          .filter((item) => item)
          .join("\n")
          .replaceAll("&nbsp;", " ");
        if (value && value.split("\n").join("")) texts[key] = value;
        else texts[key] = "";
      } else texts[key] = "";
    });
  }

  if (parameters.images) {
    parameters.images.forEach((parameter) => {
      const key = ((parameter.match(regexDocxParameter) as RegExpMatchArray) ||
        (parameter.match(regexImportDocxParameter) as RegExpMatchArray))[1];
      const keyArray = key.split("@import")[0].split("-");
      const cell = keyArray[2];
      const row = keyArray[3];
      if (Number(cell) > 0 && Number(cell) <= maxCells && Number(row) > 0 && Number(row) <= maxRows) {
        const value = (table.rows[row].cells[cell].innerHTML as string).match(regexImageSrc);
        if (value) images[key] = value[1];
        else images[key] = undefined;
      } else images[key] = undefined;
    });
  }

  if (parameters.tables) {
    parameters.tables.forEach((parameter) => {
      const key = ((parameter.match(regexDocxParameter) as RegExpMatchArray) ||
        (parameter.match(regexImportDocxParameter) as RegExpMatchArray))[1];
      const keyArray = key.split("@import")[0].split("-");
      const columnStart = keyArray[2];
      const rowStart = keyArray[3];
      const columnEnd = keyArray[4];
      const rowEnd = keyArray[5];
      const value = getRows(table, columnStart, rowStart, columnEnd, rowEnd);
      if (value) tables[key] = value;
      else tables[key] = undefined;
    });
  }

  if (parameters.dataRows) {
    parameters.dataRows.forEach((parameter) => {
      const key = ((parameter.match(regexDocxParameter) as RegExpMatchArray) ||
        (parameter.match(regexImportDocxParameter) as RegExpMatchArray))[1];
      const keyArray = key.split("-");
      const columnStart = keyArray[2];
      const rowStart = keyArray[3];
      const columnEnd = keyArray[4];
      const rowEnd = keyArray[5];
      if (columnStart !== columnEnd) dataRows[key] = undefined;
      const value = getRows(table, columnStart, rowStart, columnEnd, rowEnd);
      if (value) dataRows[key] = value;
      else dataRows[key] = undefined;
    });
  }

  return {
    texts: Object.keys(texts).length ? texts : undefined,
    images: Object.keys(images).length ? images : undefined,
    tables: Object.keys(tables).length ? tables : undefined,
    dataRows: Object.keys(dataRows).length ? dataRows : undefined,
  };
};
