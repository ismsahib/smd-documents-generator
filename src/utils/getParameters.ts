const regexTextParameter = /{<\w+-\d+-\d+>}/g; //{{([a-zA-Z0-9_]+)}}
const regexImageParameter = /{{image-\w+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}

export const getParameters = (
  textData: string
): {
  texts: Set<string> | undefined;
  images: Set<string> | undefined;
} => {
  const textsMatch = textData.match(regexTextParameter);
  const imagesMatch = textData.match(regexImageParameter);
  return {
    texts: textsMatch ? new Set(textsMatch) : undefined,
    images: imagesMatch ? new Set(imagesMatch) : undefined,
  };
};
