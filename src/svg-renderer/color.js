export function getPixelColorAtDataIndex(dataIndex, imageData) {
  return {
    r: imageData[dataIndex],
    g: imageData[dataIndex + 1],
    b: imageData[dataIndex + 2],
    a: imageData[dataIndex + 3] / 255
  };
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
