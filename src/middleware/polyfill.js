// src/middleware/polyfill.js
const buffer = require("buffer");

if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = class SlowBuffer {};
  buffer.SlowBuffer.prototype = {
    equal() {},
  };
}
