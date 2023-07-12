import { BorderStyle, ImageRun, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";

import { getImage } from "./getImage";

const regex = /https:\/\/lh3\.googleusercontent\.com\//;

export const createTable = async (rows: string[][], width: boolean, borders: boolean): Promise<Table> => {
  return new Table({
    width: width
      ? {
          size: 100,
          type: WidthType.PERCENTAGE,
        }
      : undefined,
    rows: await Promise.all(
      rows.map(async (row) => {
        return new TableRow({
          children: await Promise.all(
            row.map(async (cell) => {
              if (regex.test(cell)) {
                const { imageArrayBuffer, width, height } = await getImage(cell, true);
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageArrayBuffer,
                          transformation: { width: width, height: height },
                        }),
                      ],
                    }),
                  ],
                  borders: !borders
                    ? {
                        top: {
                          style: BorderStyle.NONE,
                        },
                        bottom: {
                          style: BorderStyle.NONE,
                        },
                        left: {
                          style: BorderStyle.NONE,
                        },
                        right: {
                          style: BorderStyle.NONE,
                        },
                      }
                    : undefined,
                });
              } else
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cell,
                          size: `${12}pt`,
                          highlight: "yellow",
                        }),
                      ],
                    }),
                  ],
                  borders: !borders
                    ? {
                        top: {
                          style: BorderStyle.NONE,
                        },
                        bottom: {
                          style: BorderStyle.NONE,
                        },
                        left: {
                          style: BorderStyle.NONE,
                        },
                        right: {
                          style: BorderStyle.NONE,
                        },
                      }
                    : undefined,
                });
            })
          ),
        });
      })
    ),
  });
};
