function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);

  setTimeout(() => {
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      isDownloading = false;
    }, 10);
  }, 10);
}

let isDownloading = false;

export function downloadSVGString(svgString) {
  if (!isDownloading && svgString) {
    isDownloading = true;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const uri = window.URL.createObjectURL(blob);

    const fileName = window.prompt('File name', 'svgurt-output');

    downloadURI(uri, `${fileName}.svg`);
  }
}
