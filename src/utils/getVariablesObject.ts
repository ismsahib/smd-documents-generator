import { getRows } from "./getRows";

const regexTextParameter = /{<([\w\d-]+)>}/;
const regexDocxParameter = /{{([\w\d-]+)}}/;
const regexImageSrc = /src="(.*?)"/;

export const getVariablesObject = (
  table: HTMLTableElement,
  parameters: {
    texts: Set<string> | undefined;
    images: Set<string> | undefined;
    tables: Set<string> | undefined;
  }
): {
  texts: Record<string, string> | undefined;
  images: Record<string, string> | undefined;
  tables: Record<string, string[][]> | undefined;
} => {
  const texts: { [a: string]: string } = {};
  const images: { [a: string]: string } = {};
  const tables: { [a: string]: string[][] } = {};

  if (parameters.texts) {
    parameters.texts.forEach((parameter) => {
      const key = (parameter.match(regexTextParameter) as RegExpMatchArray)[1];
      const keyArray = key.split("-");
      const cell = keyArray[1];
      const row = keyArray[2];
      const value = (table.rows[row].cells[cell].innerHTML as string)
        .replaceAll("<br>", "\n")
        .replaceAll(/<[^>]+>/g, "")
        .split("\n")
        .filter((item) => item)
        .join("\n");
      if (value && value.split("\n").join("")) texts[key] = value;
      else texts[key] = "";
    });
  }

  if (parameters.images) {
    parameters.images.forEach((parameter) => {
      const key = (parameter.match(regexDocxParameter) as RegExpMatchArray)[1];
      const keyArray = key.split("-");
      const cell = keyArray[2];
      const row = keyArray[3];
      const value = (table.rows[row].cells[cell].innerHTML as string).match(regexImageSrc);
      if (value) images[key] = value[1];
    });
  }

  if (parameters.tables) {
    parameters.tables.forEach((parameter) => {
      const key = (parameter.match(regexDocxParameter) as RegExpMatchArray)[1];
      const keyArray = key.split("-");
      const columnStart = keyArray[2];
      const rowStart = keyArray[3];
      const columnEnd = keyArray[4];
      const rowEnd = keyArray[5];
      const value = getRows(table, columnStart, rowStart, columnEnd, rowEnd);
      if (value) tables[key] = value;
    });
  }
  return {
    texts: Object.keys(texts).length ? texts : undefined,
    images: Object.keys(images).length ? images : undefined,
    tables: Object.keys(tables).length ? tables : undefined,
  };
};
