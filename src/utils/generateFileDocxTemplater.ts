import _ from "lodash";

import { TParameters, getParameters } from "./getParameters";
import { getSheetsID } from "./getSheetsID";
import { getTable } from "./getTable";
import { getVariablesObject } from "./getVariablesObject";
import { replaceDataRowsValues } from "./replaceDataRowsValues";
import { replaceImagesValues } from "./replaceImagesValues";
import { replaceTablesValues } from "./replaceTablesValues";
import { replaceTextsValues } from "./replaceTextsValues";

const regexImportHref = /href="(.*?)"/;

const collectVariables = async (parameters: { [a: string]: TParameters }, id: string) => {
  const currentTable = await getTable(id);

  const dataArray: { source: string; data: TParameters; table: Promise<HTMLTableElement> }[] = [
    {
      source: "internal",
      data: parameters.internal,
      table: getTable(id),
    },
  ];
  _.forEach(parameters, (parametersGroup: TParameters, parametersSource: string) => {
    const sourcePosition = parametersSource.match(/@import\((\d+),(\d+)\)/);
    if (!sourcePosition) return;

    const tableUrl = (currentTable.rows[sourcePosition[2]].cells[sourcePosition[1]].innerHTML as string).match(
      regexImportHref
    );
    if (tableUrl) {
      const tableId = getSheetsID(tableUrl[1]);
      if (tableId) {
        dataArray.push({
          source: parametersSource,
          data: parametersGroup,
          table: getTable(tableId),
        });
      }
    }
  });

  const arrayTables = dataArray.map((item) => item.table);

  const results = await Promise.all(arrayTables);
  const variables: { [a: string]: any } = dataArray.reduce(
    (result, item, index) => _.merge(result, getVariablesObject(results[index], item.data)),
    {}
  );

  return variables;
};

export const generateFileDocxTemplater = async (id: string, fileDoc: ArrayBuffer, text: string): Promise<Blob> => {
  let resultDocx: Blob | undefined = undefined;
  const parameters = getParameters(text);
  const variables = await collectVariables(parameters, id);

  if (variables.texts) resultDocx = replaceTextsValues(fileDoc, variables.texts, { start: "{<", end: ">}" });
  if (variables.texts)
    resultDocx
      ? (resultDocx = replaceTextsValues(await resultDocx.arrayBuffer(), variables.texts, {
          start: "{&lt;",
          end: "&gt;}",
        }))
      : (resultDocx = replaceTextsValues(fileDoc, variables.texts, { start: "{&lt;", end: "&gt;}" }));
  if (variables.images)
    resultDocx
      ? (resultDocx = await replaceImagesValues(resultDocx, variables.images))
      : (resultDocx = await replaceImagesValues(fileDoc, variables.images));
  if (variables.tables)
    resultDocx
      ? (resultDocx = await replaceTablesValues(resultDocx, variables.tables))
      : (resultDocx = await replaceTablesValues(fileDoc, variables.tables));
  if (variables.dataRows)
    resultDocx
      ? (resultDocx = await replaceDataRowsValues(resultDocx, variables.dataRows))
      : (resultDocx = await replaceDataRowsValues(fileDoc, variables.dataRows));

  if (resultDocx) return resultDocx;
  else return new Blob([fileDoc]);
};
