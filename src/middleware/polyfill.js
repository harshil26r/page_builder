// src/middleware/polyfill.js
import buffer from "buffer";

if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = class SlowBuffer {};
  buffer.SlowBuffer.prototype = {
    equal() {},
  };
}
