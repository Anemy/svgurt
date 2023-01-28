/* eslint-disable no-console */
const assert = require('assert');
// TODO: Once we're on node 17+ we can use the built in fetch api.
const fetch = require('node-fetch');
const fs = require('fs');

const svgurt = require('../lib/module');
const { promisify } = require('util');

async function test() {
  console.log('Running tests...');

  console.log('Running to create svg string...');
  const stringConfig = {
    input: './test/diamond.png',
    returnSVGString: true,
    svgRenderType: 'LINE'
  };

  try {
    const svgStringOutput = await svgurt(stringConfig);
    console.log('Svg string output length:', svgStringOutput.length);
  } catch (err) {
    console.log('Error trying svg string:', err);
    assert(false);
  }

  console.log('Running svg with a basic input image...');
  const basicConfig = {
    input: './test/palm.jpg',
    output: './test/palm output',
    blur: 10,
    applyFractalDisplacement: true,
    circleRadius: true,
    svgRenderType: 'CIRCLE'
  };

  try {
    await svgurt(basicConfig);
    console.log('Ran it with basic input image. Check for "palm output.svg" in this directory.');
  } catch (err) {
    console.log('Error trying basic input image:', err);
    assert(false);
  }

  console.log('Running svgurt with two input files...');
  const arrayConfig = {
    input: ['./test/palm.jpg', './test/diamond.png'],
    output: ['./test/palm in array output', './test/diamond array output'],
    svgRenderType: 'CIRCLE'
  };

  try {
    await svgurt(arrayConfig);
  } catch (err) {
    console.log('Error trying two input images:', err);
    assert(false);
  }
  console.log('Ran it with basic config on two inputs. Check for two files with array in their name in this directory.');

  const imageResponse = await fetch('https://i.imgur.com/K3aUeSr.png');
  const blob = await imageResponse.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  // const runWriteFile = promisify(fs.writeFile);
  // await runWriteFile('./test/image_buffer_test', imageBuffer);

  console.log('Running svgurt with a buffer from a url...');
  const bufferConfig = {
    imageBuffer,
    output: ['./test/buffer_svg_output'],
    svgRenderType: 'CIRCLE'
  };

  try {
    await svgurt(bufferConfig);
  } catch (err) {
    console.log('Error trying buffer:', err);
    assert(false);
  }
  console.log('Ran it with basic config on buffer, check for `buffer_svg_output` in this directory.');


  console.log('Done running tests.');
}

test();
