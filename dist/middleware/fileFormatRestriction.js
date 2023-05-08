"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFormatRestriction = void 0;
const BadRequestError_1 = require("../utils/Errors/BadRequestError");
function checkFormat(fileName, acceptedFormats) {
    const format = fileName.split(".")[1];
    if (!acceptedFormats.includes(format)) {
        throw new BadRequestError_1.BadRequestError(`${format} isn't a supported file format!`);
    }
}
function fileFormatRestriction(acceptedFormats) {
    return function (req, res, next) {
        const correctFormats = acceptedFormats.split(" ");
        const files = req.files;
        if (!files) {
            return next();
        }
        for (const key in files) {
            const file = files[key];
            if (Array.isArray(file)) {
                file.forEach(({ name }) => {
                    checkFormat(name, correctFormats);
                });
            }
            else {
                checkFormat(file.name, correctFormats);
            }
        }
        next();
    };
}
exports.fileFormatRestriction = fileFormatRestriction;
//# sourceMappingURL=fileFormatRestriction.js.map