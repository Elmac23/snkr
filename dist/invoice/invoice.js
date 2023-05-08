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
exports.invoiceRouter = exports.createInvoice = void 0;
const express_1 = require("express");
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const readFileAsync_1 = require("../utils/readFileAsync");
const zod_1 = __importDefault(require("zod"));
const uuid_1 = require("uuid");
const BadRequestError_1 = require("../utils/Errors/BadRequestError");
const uploadFile_1 = require("../utils/uploadFile");
const unlinkAsync_1 = require("../utils/unlinkAsync");
const emailSender_1 = require("../utils/emailSender");
const invoiceSchema = zod_1.default.object({
    date: zod_1.default.string(),
    name: zod_1.default.string().min(3),
    lastname: zod_1.default.string().min(2),
    email: zod_1.default.string().email(),
    postalCode: zod_1.default.string().regex(/[0-9]{2}-[0-9]{3}/),
    city: zod_1.default.string().min(2),
    street: zod_1.default.string().min(2),
    streetNumber: zod_1.default.number().min(1),
    housingNumber: zod_1.default.number().optional(),
    shoes: zod_1.default.array(zod_1.default.object({
        model: zod_1.default.string(),
        size: zod_1.default.number().min(1).max(70),
        price: zod_1.default.number().min(1),
        count: zod_1.default.number().min(1),
    })),
});
function createInvoice(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { json } = req.body;
        const jsonObject = JSON.parse(json);
        const newShoes = jsonObject.shoes.map((shoe) => {
            return {
                model: shoe.model,
                size: +shoe.size,
                price: +shoe.price,
                count: +shoe.count,
            };
        });
        const data = yield invoiceSchema.parseAsync({
            date: jsonObject.date,
            lastname: jsonObject.lastname,
            name: jsonObject.name,
            email: jsonObject.email,
            postalCode: jsonObject.postalCode,
            street: jsonObject.street,
            streetNumber: +jsonObject.streetNumber,
            housingNumber: +jsonObject.housingNumber,
            shoes: newShoes,
            city: jsonObject.city,
        });
        const signature = (_a = req.files) === null || _a === void 0 ? void 0 : _a.signature;
        if (Array.isArray(signature)) {
            throw new BadRequestError_1.BadRequestError("Expected only one image!");
        }
        const imagePath = yield (0, uploadFile_1.uploadFile)(signature, { amount: "single" });
        const [year, month, day] = jsonObject.date
            .split("T")[0]
            .split("-");
        const html = yield (0, readFileAsync_1.readFileAsync)("public/form.html", "utf-8");
        const invoiceId = (0, uuid_1.v4)().substring(0, 8);
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            footer: {
                height: "5mm",
                contents: {
                    default: `<span style="font-size: 14px">Id umowy: ${invoiceId}</span>`,
                },
            },
        };
        const document = {
            html: html,
            data: {
                year,
                month,
                day,
                lastname: jsonObject.lastname,
                name: jsonObject.name,
                postalCode: jsonObject.postalCode,
                street: jsonObject.street,
                streetNumber: jsonObject.streetNumber,
                housingNumber: jsonObject.housingNumber,
                city: jsonObject.city,
                isHousingNumber: !!jsonObject.housingNumber,
                signature: imagePath,
                shoes: jsonObject.shoes,
            },
            path: `./invoices/${invoiceId}.pdf`,
            type: "",
        };
        const { filename } = yield pdf_creator_node_1.default.create(document, options);
        yield (0, emailSender_1.sendInvoice)(jsonObject.email, `./invoices/${invoiceId}.pdf`);
        yield (0, unlinkAsync_1.unlinkAsync)(`./public/${imagePath}`);
        yield (0, unlinkAsync_1.unlinkAsync)(`./invoices/${invoiceId}.pdf`);
        res.status(201).json({});
    });
}
exports.createInvoice = createInvoice;
const invoiceRouter = (0, express_1.Router)();
exports.invoiceRouter = invoiceRouter;
invoiceRouter.post("/", createInvoice);
//# sourceMappingURL=invoice.js.map