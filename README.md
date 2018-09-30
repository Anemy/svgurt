# [Svgurt](http://svgurt.com) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Anemy/svgurt/blob/master/LICENSE) [![NPM](https://img.shields.io/npm/v/svgurt.svg)](https://www.npmjs.com/package/svgurt)

Svgurt is a configurable, interactive image to SVG converting tool.

<img src="https://i.imgur.com/HLDuuqS.png" width="60%" />

## Usage

### Installation

Install svgurt using [NPM](https://nodejs.org/en/download), and add it to your package.json dependencies:

`npm install svgurt --save`

Svgurt can then be used from the command line or programmatically as a module.

### Using Svgurt Programatically

Svgurt can be used with node js.

ES5 module:

`const svgurt = require('svgurt');`

ES6 module:

`import svgurt from 'svgurt';`

Next call svgurt with a [config](https://github.com/Anemy/svgurt#config) object:

```js
const config = {
  input: "someImage.jpg",
  output: "output file name",
  blur: 2
};

svgurt(config);
```

### CLI

Full docs can be found in the [CLI Documentation](http://svgurt.com/#/cli).

To run svgurt from command line, navigate to the folder where you have installed it using npm (or anywhere if you use the `-g` flag). Then run svgurt by supplying a config file:
`svgurt config.json`.
[Config documentation](https://github.com/Anemy/svgurt#config).

### Default Config

When using Svgurt programatically or through the command line, you need to supply a config. Any fields in your configuration that are omitted will default to the following:

```js
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
  randomSeed: 1011,
  radius: 1.5,
  radiusOnColor: true,
  radiusRandomness: 0.25,
  recursiveAlgorithm: 'fifth', // One of 'first', 'second', 'third', 'fourth', or 'fifth'.
  renderEveryXPixels: 5,
  renderEveryYPixels: 5,
  scale: 1,
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
```

## Local Development of Svgurt

### Installation

Install node js from https://nodejs.org/en/download/

```bash
$ # Clone this repo and navigate to the cloned folder.
$ npm install
```

### Development

```bash
$ npm start
$ browser https://localhost:3000
```

## Donate

If you like this project - show your love! ❤️

It will push me to make improvements and more projects like this!

Eth Wallet:
```0x4Daa587303C6929CC5b8f3FdB6F82B177c642eEc```

BTC Wallet:
```1CfnSzzMonCUSfKGeDN2C87vX13hZEcFHJ```


If you'd like to see something added, create an issue or make a PR! 🚀

### License

Svgurt is [MIT licensed](./LICENSE).