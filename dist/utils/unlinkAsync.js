"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkAsync = void 0;
const util_1 = require("util");
const fs_1 = require("fs");
exports.unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
//# sourceMappingURL=unlinkAsync.js.map