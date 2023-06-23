import { getParameters } from "./getParameters";
import { getTable } from "./getTable";
import { getVariablesObject } from "./getVariablesObject";
import { replaceImagesValues } from "./replaceImagesValues";
import { replaceTablesValues } from "./replaceTablesValues";
import { replaceTextsValues } from "./replaceTextsValues";

export const generateFileDocxTemplater = async (id: string, fileDoc: ArrayBuffer, text: string): Promise<Blob> => {
  let resultDocx: Blob | undefined = undefined;
  const table = await getTable(id);
  const parameters = getParameters(text);
  const variables = getVariablesObject(table, parameters);

  if (variables.texts) resultDocx = replaceTextsValues(fileDoc, variables.texts);
  if (variables.images)
    resultDocx
      ? (resultDocx = await replaceImagesValues(resultDocx, variables.images))
      : (resultDocx = await replaceImagesValues(fileDoc, variables.images));
  if (variables.tables)
    resultDocx
      ? (resultDocx = await replaceTablesValues(resultDocx, variables.tables))
      : (resultDocx = await replaceTablesValues(fileDoc, variables.tables));

  if (resultDocx) return resultDocx;
  else return new Blob([fileDoc]);
};
