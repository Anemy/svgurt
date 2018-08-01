'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadSVGString = downloadSVGString;
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);

  setTimeout(function () {
    link.click();

    setTimeout(function () {
      document.body.removeChild(link);
      isDownloading = false;
    }, 10);
  }, 10);
}

var isDownloading = false;

function downloadSVGString(svgString) {
  if (!isDownloading && svgString) {
    isDownloading = true;

    var blob = new Blob([svgString], { type: 'image/svg+xml' });
    var uri = window.URL.createObjectURL(blob);

    var fileName = window.prompt('File name', 'svgurt-output');

    downloadURI(uri, fileName + '.svg');
  }
}