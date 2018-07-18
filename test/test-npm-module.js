
const svgurt = require('../lib/module');

console.log('Running to create svg string...');
const stringConfig = {
  input: './test/diamond.png',
  returnSVGString: true
};

svgurt(stringConfig, (err, svgStringOutput) => {
  if (err) {
    console.log('Error trying svg string:', err);
  }
  console.log('Svg string output length:', svgStringOutput.length);
});

console.log('Running svg with a basic input image...');
const basicConfig = {
  input: './test/palm.jpg',
  output: './test/palm output',
  blur: 10,
  applyFractalDisplacement: true,
  circleRadius: true,
  svgRenderType: 'CIRCLE'
};

svgurt(basicConfig, err => {
  if (err) {
    console.log('Error trying basic input image:', err);
  }
  console.log('Ran it with basic input image. Check for "palm output.svg" in this directory.');
});

console.log('Running svgurt with two input files...');
const arrayConfig = {
  input: ['./test/palm.jpg', './test/diamond.png'],
  output: ['./test/palm in array output', './test/diamond array output']
};

svgurt(arrayConfig, err => {
  if (err) {
    console.log('Error trying two input images:', err);
  }
  console.log('Ran it with basic config on two inputs. Check for two files with array in their name in this directory.');
});
