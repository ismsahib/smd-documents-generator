import JSZip from "jszip";

import { extractSheetData } from "./extractSheetData";

const LIST_NAME = "variables";

export const getTable = async (id: string): Promise<HTMLTableElement> => {
  const URL = `https://docs.google.com/spreadsheets/d/${id}/export?format=zip`;

  const response = await fetch(URL);
  const zipFile = await response.blob();
  const zip = await JSZip.loadAsync(zipFile);
  const zipString = await zip.generateAsync({ type: "string" });
  const sheetContent = await extractSheetData(zipString, new Set([LIST_NAME]));
  const parser = new DOMParser();
  const sheetOne = parser.parseFromString(sheetContent[LIST_NAME], "text/html");
  const table = sheetOne.getElementsByTagName("table")[0];
  return table;
};
