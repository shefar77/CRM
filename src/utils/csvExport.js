export function toCSV(rows) {
  return rows
    .map(row =>
      row
        .map(cell => {
          const val     = cell == null ? '' : String(cell);
          const escaped = val.replace(/"/g, '""');
          return '"' + escaped + '"';
        })
        .join(',')
    )
    .join('\r\n');
}

export function downloadCSV(csvString, filename) {
  const BOM  = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}