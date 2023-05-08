"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsync = void 0;
const util_1 = require("util");
const fs_1 = require("fs");
exports.readFileAsync = (0, util_1.promisify)(fs_1.readFile);
//# sourceMappingURL=readFileAsync.js.map