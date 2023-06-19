const regexParameter = /{<\w+-\d+-\d+>}/; //{{([a-zA-Z0-9_]+)}}

export const getParameters = (text: string) => {
  const regex = new RegExp(regexParameter, "g");
  return new Set(text.match(regex));
};
