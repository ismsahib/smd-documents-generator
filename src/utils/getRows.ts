const getLengthRowWithOutEndSpacing = (row: string[]): number => {
  let length = row.length;
  for (let column = row.length - 1; column > 0; column--) {
    if (!row[column]) length--;
    else return length;
  }
  return length;
};

export const getRows = (
  table: HTMLTableElement,
  columnStart: string,
  rowStart: string,
  columnEnd: string,
  rowEnd: string
): Array<string[]> | undefined => {
  const maxColumn = table.rows[0].cells.length - 1;
  const maxRow = table.tBodies[0].rows.length;
  if (
    Number(columnStart) > maxColumn ||
    Number(columnEnd) > maxColumn ||
    Number(rowStart) > maxRow ||
    Number(rowEnd) > maxRow
  ) {
    return undefined;
  }
  const rows: Array<string[]> = [];
  let maxRowLength = 0;
  for (let row = Number(rowStart); row <= Number(rowEnd); row++) {
    const currentRow: string[] = [];
    for (let column = Number(columnStart); column <= Number(columnEnd); column++) {
      currentRow.push(table.rows[row].cells[column].innerText);
    }
    if (currentRow.length && currentRow.join("")) {
      rows.push(currentRow);
      maxRowLength = Math.max(maxRowLength, getLengthRowWithOutEndSpacing(currentRow));
    }
  }

  for (let row = 0; row < rows.length; row++) {
    for (let columns = rows[row].length - 1; columns >= maxRowLength; columns--) {
      if (!rows[row][columns]) rows[row].pop();
    }
  }

  const emptyIndex: number[] = [];
  for (let row = 0; row < rows.length; row++) {
    for (let columns = 0; columns < rows[row].length; columns++) {
      if (!rows[row][columns]) emptyIndex.push(columns);
    }
  }
  const emptyIndexObj = emptyIndex.reduce((acc, i) => {
    if (Object.keys(acc).includes(String(i))) {
      acc[i] += 1;
    } else {
      acc[i] = 1;
    }
    return acc;
  }, {});

  for (const [key, value] of Object.entries(emptyIndexObj)) {
    if (value === rows.length) {
      for (let row = 0; row < rows.length; row++) {
        rows[row].splice(Number(key), 1);
      }
    }
  }
  return rows;
};
