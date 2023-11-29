"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandling_js_1 = require("../middleware/errorHandling.js");
const notFound_js_1 = require("../middleware/notFound.js");
const invoice_js_1 = require("../invoice/invoice.js");
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const fileFormatRestriction_js_1 = require("../middleware/fileFormatRestriction.js");
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, express_fileupload_1.default)({
        limits: { fileSize: 50 * 1024 * 1024 },
    }));
    app.use((0, fileFormatRestriction_js_1.fileFormatRestriction)("png"));
    app.use((0, morgan_1.default)("dev"));
    app.use("/", invoice_js_1.invoiceRouter);
    app.use(express_1.default.static("public"));
    app.get("/*", function (req, res) {
        res.sendFile(path_1.default.join(__dirname, "../../public/index.html"));
    });
    app.use(notFound_js_1.notFound);
    app.use(errorHandling_js_1.errorHandling);
    return app;
}
exports.createServer = createServer;
//# sourceMappingURL=server.js.map