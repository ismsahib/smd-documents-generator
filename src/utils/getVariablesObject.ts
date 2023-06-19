const regexParameter = /{<([\w\d-]+)>}/;

export const getVariablesObject = (table: HTMLTableElement, parameters: Set<string>) => {
  const variables: { [a: string]: string } = {};

  parameters.forEach((parameter) => {
    const key = (parameter.match(regexParameter) as RegExpMatchArray)[1];
    const keyArray = key.split("-");
    const cell = keyArray[1];
    const row = keyArray[2];
    const value = (table.rows[row].cells[cell].innerHTML as string).replaceAll("<br>", "\n").replaceAll(/<[^>]+>/g, "");
    if (value && value.split("\n").join("")) variables[key] = value;
    else variables[key] = "";
  });

  return variables;
};
