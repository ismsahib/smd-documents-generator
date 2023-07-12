const regexTextParameter = /{<\w+-\d+-\d+>}/g; //{{([a-zA-Z0-9_]+)}}
const regexImageParameter = /{{image-\w+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}
const regexTableParameter = /{{table-\w+-\d+-\d+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}
const regexDataRowsParameter = /{{dataRows-\w+-\d+-\d+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}

export const getParameters = (
  textData: string
): {
  texts: Set<string> | undefined;
  images: Set<string> | undefined;
  tables: Set<string> | undefined;
  dataRows: Set<string> | undefined;
} => {
  const textsMatch = textData.match(regexTextParameter);
  const imagesMatch = textData.match(regexImageParameter);
  const tablesMatch = textData.match(regexTableParameter);
  const dataRowssMatch = textData.match(regexDataRowsParameter);

  return {
    texts: textsMatch ? new Set(textsMatch) : undefined,
    images: imagesMatch ? new Set(imagesMatch) : undefined,
    tables: tablesMatch ? new Set(tablesMatch) : undefined,
    dataRows: dataRowssMatch ? new Set(dataRowssMatch) : undefined,
  };
};
