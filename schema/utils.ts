/**
 * Helper function that start a download on the user browser of a specified file
 * @param {string|Buffer} data - The file data/content
 * @param {string} type - The file MIME type
 * @param {string} filename - The file name when downloading
 */
export const downloadFile = (data: string | Buffer, type: string, filename: string) => {
  // Converts the data to a Blob object
  const blob = new Blob([data], { type });

  // Creates a DOM <a> element with the blob data and desired filename
  const anchor = window.document.createElement('a');
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = filename;

  // Appends the <a> to the body and clicks it, then removes it
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
