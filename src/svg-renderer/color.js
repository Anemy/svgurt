export function getPixelColorAtDataIndex(imageData, dataIndex) {
  return {
    r: imageData[dataIndex],
    g: imageData[dataIndex + 1],
    b: imageData[dataIndex + 2],
    a: imageData[dataIndex + 3] / 255
  };
}

export function getPixelColorAtXY(imageData, x, y, width) {
  const dataIndex = (Math.round(x) + (Math.round(y) * width)) * 4;

  return getPixelColorAtDataIndex(imageData, dataIndex);
}

export function isInColorThreshhold(color, controls) {
  const {
    minColorRecognized,
    maxColorRecognized
  } = controls;

  return color.r >= minColorRecognized &&
         color.g >= minColorRecognized &&
         color.b >= minColorRecognized &&
         color.r <= maxColorRecognized &&
         color.g <= maxColorRecognized &&
         color.b <= maxColorRecognized;
}
