const regexTextParameter = /{<\w+-\d+-\d+>}/g; //{{([a-zA-Z0-9_]+)}}
const regexTextReserveParameter = /{&lt;\w+-\d+-\d+&gt;}/g; //{{([a-zA-Z0-9_]+)}}
const regexImageParameter = /{{image-\w+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}
const regexTableParameter = /{{table-\w+-\d+-\d+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}
const regexImportsParameter = /@import\((\d+),(\d+)\)/g; //{{([a-zA-Z0-9_]+)}}
const regexDataRowsParameter = /{{dataRows-\w+-\d+-\d+-\d+-\d+}}/g; //{{([a-zA-Z0-9_]+)}}

export type TParameters = {
  texts: Set<string> | undefined;
  images: Set<string> | undefined;
  tables: Set<string> | undefined;
  dataRows: Set<string> | undefined;
};

// возвращает matches по двум regexp для data выражениям
const getMatches = (data: string, regex1: RegExp, regex2?: RegExp) => {
  const matches = data.match(
    regex2
      ? new RegExp(regex1.source.slice(0, -2) + regex2.source + regex1.source.slice(-2), regex1.flags)
      : new RegExp(regex1)
  ) as string[];
  return matches ? new Set(matches) : undefined;
};

export const getParameters = (
  textData: string
): {
  [a: string]: TParameters;
} => {
  // параметры без @import (внутри текущей таблицы)
  const textMatches = [
    ...(getMatches(textData, regexTextParameter) || []),
    ...(getMatches(textData, regexTextReserveParameter) || []),
  ];

  const internal = {
    texts: textMatches.length ? new Set(textMatches) : undefined,
    images: getMatches(textData, regexImageParameter),
    tables: getMatches(textData, regexTableParameter),
    dataRows: getMatches(textData, regexDataRowsParameter),
  };

  const external = {};

  // список источников @import
  const sources = new Set(textData.match(regexImportsParameter));

  sources.forEach((source) => {
    const sourceRegexp = new RegExp(source.split("(").join("\\(").split(")").join("\\)"));

    const textMatches = [
      ...(getMatches(textData, regexTextParameter, sourceRegexp) || []),
      ...(getMatches(textData, regexTextReserveParameter, sourceRegexp) || []),
    ];
    // параметры с @import
    external[source] = {
      texts: textMatches.length ? new Set(textMatches) : undefined,
      images: getMatches(textData, regexImageParameter, sourceRegexp),
      tables: getMatches(textData, regexTableParameter, sourceRegexp),
      dataRows: getMatches(textData, regexDataRowsParameter, sourceRegexp),
    };
  });

  return {
    internal,
    ...external,
  };
};
