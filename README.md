Live @ [svgurt.com](http://svgurt.com)

## Usage

### Installation

Install svgurt using [NPM](https://nodejs.org/en/download), and add it to your package.json dependencies:

`npm install svgurt --save`

Svgurt can then be used from the command line or programmatically as a module.

### Programatically

Use Svgurt Programatically with node js or js on the client.

ES5 module:

`const svgurt = require('svgurt');`

ES6 module:

`import svgurt from 'svgurt';`

Then call svgurt with a [config](https://github.com/Anemy/svgurt#config) object:

```js
svgurt({
  input: "someImage.jpg",
  output: "output file name",
  blur: 2
});
```

### CLI

Full docs can be found in the [CLI Documentation](http://svgurt.com/#/cli)

To run svgurt from command line, navigate to the folder where you have installed it using npm (or anywhere if you use the `-g` flag). Then run svgurt by supplying a config file:
`svgurt config.json`.
[Config documentation](https://github.com/Anemy/svgurt#config).

### Default Config

When using Svgurt programatically or through the command line, you need to supply a config. Any fields in your configuration that are omitted will default to the following:

```js
{
  input: "image.jpg",
  output: "svgurt-output",
  blur: 0,
  grayscale: false
  // TODO: Add the rest of the config options here and in the cli config.
}
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
