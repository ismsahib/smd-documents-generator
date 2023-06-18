const regexParameter = /{{([\w\d-]+)}}/;

export const getVariablesObject = (table: HTMLTableElement, parameters: Set<string>) => {
  const variables: { [a: string]: string } = {};

  parameters.forEach((parameter) => {
    const key = (parameter.match(regexParameter) as RegExpMatchArray)[1];
    const keyArray = key.split("-");
    const cell = keyArray[1];
    const row = keyArray[2];
    variables[key] = (table.rows[row].cells[cell].innerHTML as string)
      .replaceAll("<br>", "#ENTER#")
      .replaceAll(/<[^>]+>/g, "");
  });

  return variables;
};
