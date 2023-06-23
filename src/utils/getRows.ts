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
  for (let row = Number(rowStart); row <= Number(rowEnd); row++) {
    const currentRow: string[] = [];
    for (let column = Number(columnStart); column <= Number(columnEnd); column++) {
      currentRow.push(table.rows[row].cells[column].innerText);
    }
    rows.push(currentRow);
  }
  return rows;
};
