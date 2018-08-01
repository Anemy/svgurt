import noise from '../utils/noise';

export function getFractalDispacementForPoint(
  x,
  y,
  { displacementAmount, fractalRatioX, fractalRatioY, fractalRandomSeed }
) {
  noise.seed(fractalRandomSeed);

  const angleNoiseValue =
    Math.abs(noise.simplex2(x * fractalRatioX, y * fractalRatioY)) *
    Math.PI *
    2;
  const displacementNoiseValue =
    Math.abs(
      noise.simplex2(x * fractalRatioX + 20000, y * fractalRatioY + 20000)
    ) * displacementAmount;

  return {
    xDisplacement: Math.cos(angleNoiseValue) * displacementNoiseValue,
    yDisplacement: Math.sin(angleNoiseValue) * displacementNoiseValue
  };
}
