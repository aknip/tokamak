#!/usr/bin/env node

/**
 * Module dependencies.
 */


const fs = require("fs");
const svg2png = require("svg2png");

  
  var input = fs.readFileSync('build/icons/gecko.svg');
  
  console.log('creating icon 1/19 ...');
  var outputBuffer = svg2png.sync(input, { width: 192, height: 192 })  
  fs.writeFileSync('build/icons/main-icon-192x192.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 2/19 ...');
  outputBuffer = svg2png.sync(input, { width: 57, height: 57 })  
  fs.writeFileSync('build/icons/apple-touch-icon-57x57.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 3/19 ...');
  outputBuffer = svg2png.sync(input, { width: 114, height: 114 })  
  fs.writeFileSync('build/icons/apple-touch-icon-114x114.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 4/19 ...');
  outputBuffer = svg2png.sync(input, { width: 72, height: 72 })  
  fs.writeFileSync('build/icons/apple-touch-icon-72x72.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 5/19 ...');
  outputBuffer = svg2png.sync(input, { width: 144, height: 144 })  
  fs.writeFileSync('build/icons/apple-touch-icon-144x144.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 6/19 ...');
  outputBuffer = svg2png.sync(input, { width: 60, height: 60 })  
  fs.writeFileSync('build/icons/apple-touch-icon-60x60.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 7/19 ...');
  outputBuffer = svg2png.sync(input, { width: 120, height: 120 })  
  fs.writeFileSync('build/icons/apple-touch-icon-120x120.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 8/19 ...');
  outputBuffer = svg2png.sync(input, { width: 76, height: 76 })  
  fs.writeFileSync('build/icons/apple-touch-icon-76x76.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 9/19 ...');
  outputBuffer = svg2png.sync(input, { width: 152, height: 152 })  
  fs.writeFileSync('build/icons/apple-touch-icon-152x152.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 10/19 ...');
  outputBuffer = svg2png.sync(input, { width: 196, height: 196 })  
  fs.writeFileSync('build/icons/favicon-196x196.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 11/19 ...');
  outputBuffer = svg2png.sync(input, { width: 96, height: 96 })  
  fs.writeFileSync('build/icons/favicon-96x96.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 12/19 ...');
  outputBuffer = svg2png.sync(input, { width: 32, height: 32 })  
  fs.writeFileSync('build/icons/favicon-32x32.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 13/19 ...');
  outputBuffer = svg2png.sync(input, { width: 16, height: 16 })  
  fs.writeFileSync('build/icons/favicon-16x16.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 14/19 ...');
  outputBuffer = svg2png.sync(input, { width: 128, height: 128 })  
  fs.writeFileSync('build/icons/favicon-128x128.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 15/19 ...');
  outputBuffer = svg2png.sync(input, { width: 144, height: 144 })  
  fs.writeFileSync('build/icons/mstile-144x144.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 16/19 ...');
  outputBuffer = svg2png.sync(input, { width: 70, height: 70 })  
  fs.writeFileSync('build/icons/mstile-70x70.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 17/19 ...');
  outputBuffer = svg2png.sync(input, { width: 150, height: 150 })  
  fs.writeFileSync('build/icons/mstile-150x150.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 18/19 ...');
  outputBuffer = svg2png.sync(input, { width: 310, height: 150 })  
  fs.writeFileSync('build/icons/mstile-310x150.png', outputBuffer, { flag: "w" }); // overwrite
  console.log('creating icon 19/19 ...');
  outputBuffer = svg2png.sync(input, { width: 310, height: 310 })  
  fs.writeFileSync('build/icons/mstile-310x310.png', outputBuffer, { flag: "w" }); // overwrite
  
