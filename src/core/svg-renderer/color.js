export function getPixelColorAtDataIndex(imageData, dataIndex) {
  return {
    r: imageData[dataIndex],
    g: imageData[dataIndex + 1],
    b: imageData[dataIndex + 2],
    a: imageData[dataIndex + 3] / 255
  };
}

export function getPixelColorAtXY(imageData, x, y, width) {
  const dataIndex = (Math.round(x) + Math.round(y) * width) * 4;

  return getPixelColorAtDataIndex(imageData, dataIndex);
}

export function isInColorThreshhold(pixel, controls) {
  const { minColorRecognized, maxColorRecognized } = controls;

  return (
    pixel.r >= minColorRecognized &&
    pixel.g >= minColorRecognized &&
    pixel.b >= minColorRecognized &&
    pixel.r <= maxColorRecognized &&
    pixel.g <= maxColorRecognized &&
    pixel.b <= maxColorRecognized
  );
}

export function getPixelColorIntensity(pixel, settings) {
  const { minColorRecognized, maxColorRecognized } = settings;

  const r = pixel.r - minColorRecognized;
  const g = pixel.g - minColorRecognized;
  const b = pixel.b - minColorRecognized;
  const colorSum = Math.max(1, r + g + b);

  const outOf = Math.max(1, Math.abs(maxColorRecognized - minColorRecognized));

  return colorSum / 3 / outOf;
}
