//const regexWidthHeight = /w(\d+)-h(\d+)$/;
//const regexBody = /^(.*?)(?==w\d+-h\d+)/;

const MAX_WIDTH = 100;
const MAX_HEIGHT = 100;

export const getImage = async (imageUrl: string, resize: boolean) => {
  const widthAndHeight: { width: number; height: number } = { width: 100, height: 100 };
  const bodyURL = imageUrl.split("=")[0];
  const response = await fetch(bodyURL);
  const imageBlob = await response.blob();
  const imageArrayBuffer = await imageBlob.arrayBuffer();
  await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onload = () => {
      const newImage = document.createElement("img");
      newImage.src = reader.result as string;
      newImage.onload = (eventImage: ProgressEvent<HTMLImageElement> | Event) => {
        const currentImage = eventImage.target as HTMLImageElement;
        widthAndHeight.width = currentImage.width;
        widthAndHeight.height = currentImage.height;
        res(true);
      };
    };
  });
  const newSize = { ...widthAndHeight };
  if (resize) {
    if (widthAndHeight.width > MAX_WIDTH || widthAndHeight.height > MAX_HEIGHT) {
      if (widthAndHeight.width > widthAndHeight.height) {
        const ratio = MAX_WIDTH / widthAndHeight.width;
        newSize.width = MAX_WIDTH;
        newSize.height = widthAndHeight.width * ratio;
      } else {
        if (widthAndHeight.width < widthAndHeight.height) {
          const ratio = MAX_HEIGHT / widthAndHeight.height;
          newSize.height = MAX_HEIGHT;
          newSize.width = widthAndHeight.width * ratio;
        } else {
          newSize.width = Math.min(MAX_WIDTH, MAX_HEIGHT);
          newSize.height = Math.min(MAX_WIDTH, MAX_HEIGHT);
        }
      }
    }
  }
  return { imageArrayBuffer, ...newSize };
};
