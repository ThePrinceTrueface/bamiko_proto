export function downloadCSV(filename: string, csvContent: string) {
  // Add BOM for Excel UTF-8 compatibility
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function convertToCSV(objArray: any[]) {
  if (!objArray || objArray.length === 0) return '';
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  
  // Headers
  const headers = Object.keys(array[0]);
  // Use semicolon for French Excel compatibility
  str += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(';') + '\r\n';

  // Rows
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (line !== '') line += ';';
      let value = array[i][index] !== null && array[i][index] !== undefined ? String(array[i][index]) : '';
      // Escape quotes
      value = `"${value.replace(/"/g, '""')}"`;
      line += value;
    }
    str += line + '\r\n';
  }
  return str;
}
