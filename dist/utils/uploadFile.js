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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const path_1 = __importDefault(require("path"));
const BadRequestError_1 = require("./Errors/BadRequestError");
const uuid_1 = require("uuid");
function uploadFile(file, options = {}, filePath = "./public/") {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new BadRequestError_1.BadRequestError("File not found!");
        }
        if (Array.isArray(file)) {
            if (options.amount === "single") {
                throw new BadRequestError_1.BadRequestError("Expected multiple files!");
            }
            const fileNames = [];
            file.forEach((f) => __awaiter(this, void 0, void 0, function* () {
                const format = f.name.split(".")[1];
                const imageId = (0, uuid_1.v4)();
                const newName = `${imageId}.${format}`;
                yield f.mv(path_1.default.resolve(filePath, newName));
                fileNames.push(newName);
            }));
            return fileNames;
        }
        else {
            if (options.amount === "multiple") {
                throw new BadRequestError_1.BadRequestError("Expected single file!");
            }
            const format = file.name.split(".")[1];
            const imageId = (0, uuid_1.v4)();
            const newName = `${imageId}.${format}`;
            yield file.mv(path_1.default.resolve(filePath, newName));
            return newName;
        }
    });
}
exports.uploadFile = uploadFile;
//# sourceMappingURL=uploadFile.js.map