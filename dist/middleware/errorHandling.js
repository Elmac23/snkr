"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = void 0;
const http_status_codes_1 = require("http-status-codes");
function errorHandling(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(err.message);
        const { statusCode } = err;
        return res
            .status(statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: err.message });
    });
}
exports.errorHandling = errorHandling;
//# sourceMappingURL=errorHandling.js.map