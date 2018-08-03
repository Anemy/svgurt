export default `
# Svgurt CLI Usage & Documentation

Svgurt is open source on [Github](https://github.com/Anemy/svgurt) - help improve these docs. :D

### Installation

Install svgurt using [NPM](https://nodejs.org/en/download), and add it to your package.json dependencies:

\`npm install svgurt --save\`

Svgurt can then be used from the command line or programmatically as a module.

### Usage & Configuration

To run svgurt from command line, navigate to the folder where you have installed svgurt using npm (or anywhere if you use the \`-g\` flag).

Then run the \`svgurt\` command and supply a config file name as the first argument.

The config file can either be stored as \`.json\` or \`.js\`.
\`\`\`bash
svgurt config
\`\`\`

An example of a config file can be found on [Github](https://github.com/Anemy/svgurt/blob/master/test/config.json)

The available configurations and the defaults are as follows:

\`\`\`js
{
  input: 'image.jpg', // This can be an array of input file names as well. jpg and png are both supported.
  output: 'svgurt-output', // This is the name of the file svgurt will save to if 'returnSVGString' is 'false'. It will also accept an array sequentially coupled with 'input'.
  returnSVGString: false, // When true the cli or module will return the svg output as a string instead of saving to a file.
  
  // Image Controls
  blur: 0,
  grayscale: false,
  invert: false,
  'Edge Detection': false,
  postBlur: 0,
  posterize: false,
  posterizeLevels: 5,
  lowThreshold: 20,
  highThreshold: 50,
  applyFractalField: false,
  fieldOpacity: 0.5,
  fieldRatioX: 0.01,
  fieldRatioY: 0.01,
  fieldRandomSeed: 9661,

  // SVG Controls
  amplitude: 5,
  amplitudeRandomness: 0.5,
  amountOfLines: 150,
  continuous: false,
  crossHatch: true,
  direction: 30,
  directionRandomness: 0.01,
  displaceOrigin: false,
  lineLength: 6,
  lengthOnColor: true,
  lengthRandomness: 0.2,
  minColorRecognized: 50,
  maxColorRecognized: 200,
  maxRecursiveDepth: 150,
  minLineLength: 1,
  outputScale: 1,
  randomSeed: 1011,
  radius: 1.5,
  radiusOnColor: true,
  radiusRandomness: 0.25,
  recursiveAlgorithm: 'fifth', // One of 'first', 'second', 'third', 'fourth', or 'fifth'.
  renderEveryXPixels: 5,
  renderEveryYPixels: 5,
  startAtCenterOfShapes: false,
  strokeColor: 'rgb(28, 32, 38)',
  strokeWidth: 1,
  strokeWidthRandomness: 0.1,
  svgRenderType: 'RECURSIVE', // One of: 'CIRCLE', 'CURVE', 'LINE', 'RECURSIVE', or 'CONCENTRIC'.
  wavelength: 3,
  wavelengthRandomness: 0.5,
  waves: 3,
  wavesRandomness: 0.5,
  applyFractalDisplacement: false,
  displacementAmount: 5,
  fractalRatioX: 0.01,
  fractalRatioY: 0.01,
  fractalRandomSeed: 9996,
  autoColor: false,
  circleArcs: 200,
  intensityWeight: 100000,
  radiusStep: '5'
}
\`\`\`
`;
