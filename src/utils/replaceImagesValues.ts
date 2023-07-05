import { ImageRun, PatchType, TextRun, patchDocument } from "docx";

import { getImage } from "./getImage";

export const replaceImagesValues = async (
  fileDoc: Blob | ArrayBuffer,
  imagesVariables: Record<string, string | undefined>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(imagesVariables)) {
    if (value) {
      const { imageArrayBuffer, width, height } = await getImage(value, false);
      patches[key] = {
        type: PatchType.PARAGRAPH,
        children: [
          new ImageRun({
            data: imageArrayBuffer,
            transformation: { width: width, height: height },
          }),
        ],
      };
    } else {
      patches[key] = {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      };
    }
  }

  const doc = await patchDocument(fileDoc, { patches: patches });
  return new Blob([doc]);
};
