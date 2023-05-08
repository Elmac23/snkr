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
exports.notFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const APIError_js_1 = require("../utils/Errors/APIError.js");
function notFound(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { protocol, hostname, url } = req;
        const message = `No endpoint found for URL: ${protocol}://${hostname}${url}`;
        throw new APIError_js_1.APIError(message, http_status_codes_1.StatusCodes.NOT_FOUND);
    });
}
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map