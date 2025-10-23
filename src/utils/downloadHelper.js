/**
 * Utilidades para descarga de archivos
 */

/**
 * Descarga un archivo PDF
 * @param {Blob} blob - El blob del archivo
 * @param {string} nombreBase - Nombre base del archivo (sin extensión)
 */
export const descargarPDF = (blob, nombreBase = 'reporte') => {
  const timestamp = new Date().getTime();
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  descargarArchivo(pdfBlob, `${nombreBase}_${timestamp}.pdf`, 'application/pdf');
};

/**
 * Descarga un archivo Excel
 * @param {Blob} blob - El blob del archivo
 * @param {string} nombreBase - Nombre base del archivo (sin extensión)
 */
export const descargarExcel = (blob, nombreBase = 'reporte') => {
  const timestamp = new Date().getTime();
  const excelBlob = new Blob([blob], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  descargarArchivo(excelBlob, `${nombreBase}_${timestamp}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * Descarga un archivo genérico
 * @param {Blob} blob - El blob del archivo
 * @param {string} nombreArchivo - Nombre completo del archivo (con extensión)
 * @param {string} tipo - Tipo MIME del archivo
 */
export const descargarArchivo = (blob, nombreArchivo, tipo) => {
  const blobFinal = new Blob([blob], { type: tipo });
  const url = window.URL.createObjectURL(blobFinal);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nombreArchivo);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Formatea un nombre de archivo con timestamp
 * @param {string} base - Nombre base del archivo
 * @param {string} extension - Extensión del archivo
 * @returns {string} - Nombre formateado
 */
export const formatearNombreArchivo = (base, extension) => {
  const fecha = new Date();
  const timestamp = fecha.toISOString().split('T')[0];
  return `${base}_${timestamp}.${extension}`;
};

/**
 * Valida si un blob es válido
 * @param {Blob} blob - El blob a validar
 * @returns {boolean} - True si es válido
 */
export const validarBlob = (blob) => {
  return blob && blob instanceof Blob && blob.size > 0;
};
