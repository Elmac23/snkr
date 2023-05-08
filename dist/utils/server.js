"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
require("express-async-errors");
const express_1 = __importStar(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandling_js_1 = require("../middleware/errorHandling.js");
const notFound_js_1 = require("../middleware/notFound.js");
const invoice_js_1 = require("../invoice/invoice.js");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const fileFormatRestriction_js_1 = require("../middleware/fileFormatRestriction.js");
function createServer() {
    const app = (0, express_1.default)();
    const masterRouter = (0, express_1.Router)();
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
    masterRouter.use("/invoices", invoice_js_1.invoiceRouter);
    app.use("/", masterRouter);
    app.use(express_1.default.static("public"));
    app.use(notFound_js_1.notFound);
    app.use(errorHandling_js_1.errorHandling);
    return app;
}
exports.createServer = createServer;
//# sourceMappingURL=server.js.map