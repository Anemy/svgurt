"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRandomSeed = createRandomSeed;
var MAX_SEED = exports.MAX_SEED = 10000;

function createRandomSeed() {
  return Math.floor(Math.random() * MAX_SEED);
}