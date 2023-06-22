import { ImageRun, PatchType, patchDocument } from "docx";

export const replaceImagesValues = async (
  fileDoc: Blob | ArrayBuffer,
  imagesVariables: Record<string, string>
): Promise<Blob> => {
  const patches = {};
  for (const [key, value] of Object.entries(imagesVariables)) {
    const response = await fetch(value);
    const image = await response.blob();
    const imageArrayBuffer = await image.arrayBuffer();
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const newImage = document.createElement("img");
      newImage.src = reader.result as string;
      newImage.onload = (eventImage: ProgressEvent<HTMLImageElement> | Event) => {
        const currentImage = eventImage.target as HTMLImageElement;
        patches[key] = {
          type: PatchType.PARAGRAPH,
          children: [
            new ImageRun({
              data: imageArrayBuffer,
              transformation: { width: currentImage.width, height: currentImage.height },
            }),
          ],
        };
      };
    };
  }
  const doc = await patchDocument(fileDoc, { patches: patches });
  return new Blob([doc]);
};