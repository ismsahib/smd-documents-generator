import JSZip from "jszip";

export const extractSheetData = async (sheetData: string, lists: Set<string>): Promise<Record<string, string>> => {
  const zipFile = await JSZip.loadAsync(sheetData);
  const { files } = zipFile;
  const extHtml = ".html";
  const filteredFiles = Object.keys(files).filter((fileName) =>
    lists.has(fileName.endsWith(extHtml) ? fileName.slice(0, -extHtml.length) : fileName)
  );
  const sheetContent = await Promise.all(
    filteredFiles.map(async (fileName) => {
      const file = files[fileName];
      const content = await file.async("string");
      return { fileName, content };
    })
  );
  const sheetObject = sheetContent.reduce(
    (
      obj: Record<string, string>,
      item: {
        fileName: string;
        content: string;
      }
    ) => {
      return {
        ...obj,
        [item.fileName.slice(0, -extHtml.length)]: item.content,
      };
    },
    {}
  );
  return sheetObject;
};
