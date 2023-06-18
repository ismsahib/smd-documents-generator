const regexpGoogleSheets = /^https:\/\/docs.google.com\/spreadsheets\/d\//;

export const getSheetsID = (url: string): string | null => {
  if (regexpGoogleSheets.test(url)) {
    const id = url.split("/")[5];
    if (id) return id;
    else return null;
  } else return null;
};
