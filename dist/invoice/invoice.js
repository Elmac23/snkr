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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRouter = exports.deleteInvoiceById = exports.getInvoiceById = exports.getInvoices = exports.login = exports.regenerateInvoice = exports.createInvoice = void 0;
const express_1 = require("express");
const pdf_creator_node_1 = __importDefault(require("pdf-creator-node"));
const readFileAsync_1 = require("../utils/readFileAsync");
const uuid_1 = require("uuid");
const BadRequestError_1 = require("../utils/Errors/BadRequestError");
const uploadFile_1 = require("../utils/uploadFile");
const unlinkAsync_1 = require("../utils/unlinkAsync");
const emailSender_1 = require("../utils/emailSender");
const schema_1 = require("./schema");
const main_1 = require("../main");
const NotFoundError_1 = require("../utils/Errors/NotFoundError");
const bcrypt_1 = require("bcrypt");
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ForbiddenError_1 = require("../utils/Errors/ForbiddenError");
const authorize_1 = require("../middleware/authorize");
(0, dotenv_1.config)();
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
        const _b = yield schema_1.invoiceSchema.parseAsync({
            date: jsonObject.date,
            lastname: jsonObject.lastname,
            name: jsonObject.name,
            email: jsonObject.email,
            postalCode: jsonObject.postalCode,
            street: jsonObject.street,
            streetNumber: jsonObject.streetNumber,
            housingNumber: +jsonObject.housingNumber,
            shoes: newShoes,
            city: jsonObject.city,
            country: jsonObject.country,
            currency: jsonObject.currency,
        }), { shoes } = _b, data = __rest(_b, ["shoes"]);
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
        yield main_1.prismaClient.invoice.create({
            data: Object.assign(Object.assign({ id: invoiceId }, data), { signatureLink: imagePath, shoes: {
                    createMany: {
                        data: newShoes,
                    },
                } }),
        });
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            footer: {
                height: "5mm",
                contents: {
                    default: `<span style="font-size: 10px">Id umowy: ${invoiceId}</span>`,
                },
            },
        };
        const currencyMark = {
            PLN: "zł",
            EUR: "€",
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
                country: jsonObject.country,
                currency: jsonObject.currency,
            },
            path: `./invoices/${invoiceId}.pdf`,
            type: "",
        };
        const { filename } = yield pdf_creator_node_1.default.create(document, options);
        yield (0, emailSender_1.sendInvoice)(jsonObject.email, `./invoices/${invoiceId}.pdf`);
        yield (0, unlinkAsync_1.unlinkAsync)(`./invoices/${invoiceId}.pdf`);
        res.status(201).json({});
    });
}
exports.createInvoice = createInvoice;
function regenerateInvoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const invoice = yield main_1.prismaClient.invoice.findUnique({
            where: {
                id: id,
            },
            include: {
                shoes: true,
            },
        });
        if (!invoice)
            throw new NotFoundError_1.NotFoundError("Invoice not found!");
        const [year, month, day] = invoice.date.split("T")[0].split("-");
        const html = yield (0, readFileAsync_1.readFileAsync)("public/form.html", "utf-8");
        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            footer: {
                height: "5mm",
                contents: {
                    default: `<span style="font-size: 10px">Id umowy: ${id}</span>`,
                },
            },
        };
        const currencyMark = {
            PLN: "zł",
            EUR: "€",
        };
        const document = {
            html: html,
            data: {
                year,
                month,
                day,
                lastname: invoice.lastname,
                name: invoice.name,
                postalCode: invoice.postalCode,
                street: invoice.street,
                streetNumber: invoice.streetNumber,
                housingNumber: invoice.housingNumber,
                city: invoice.city,
                isHousingNumber: !!invoice.housingNumber,
                shoes: invoice.shoes,
                country: invoice.country,
                currency: invoice.currency,
                signature: invoice.signatureLink,
            },
            path: `./invoices/${id}.pdf`,
            type: "",
        };
        const { filename } = yield pdf_creator_node_1.default.create(document, options);
        res.status(200).download(`./invoices/${id}.pdf`, filename);
    });
}
exports.regenerateInvoice = regenerateInvoice;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = req.body;
        if (!login || !password)
            throw new BadRequestError_1.BadRequestError("Login and password are mandatory!");
        const passwordResult = yield (0, bcrypt_1.compare)(password, process.env.APP_PASSWORD);
        const loginResult = login === process.env.APP_LOGIN;
        if (!passwordResult || !loginResult)
            throw new ForbiddenError_1.ForbiddenError("Invalid login or password!");
        const token = jsonwebtoken_1.default.sign({ login }, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });
        res.status(200).json({ token });
    });
}
exports.login = login;
function getInvoices(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page, limit, query, orderByDate } = req.query;
        const newQuery = query || "";
        const newOrderByDate = orderByDate === "asc" ? orderByDate : "desc";
        const invoices = yield main_1.prismaClient.shoe.findMany({
            take: Number(limit) || 10,
            skip: (Number(page) - 1) * Number(limit) || 0,
            orderBy: {
                Invoice: {
                    date: newOrderByDate,
                },
            },
            include: {
                Invoice: true,
            },
            where: {
                OR: [
                    {
                        Invoice: {
                            name: {
                                contains: newQuery,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        Invoice: {
                            email: {
                                contains: newQuery,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        Invoice: {
                            lastname: {
                                contains: newQuery,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        model: {
                            contains: newQuery,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        res.status(200).json(invoices);
    });
}
exports.getInvoices = getInvoices;
function getInvoiceById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const invoice = yield main_1.prismaClient.invoice.findUnique({
            where: {
                id: id,
            },
            include: {
                shoes: true,
            },
        });
        if (!invoice)
            throw new NotFoundError_1.NotFoundError("Invoice not found!");
        res.status(200).json(invoice);
    });
}
exports.getInvoiceById = getInvoiceById;
function deleteInvoiceById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const invoice = yield main_1.prismaClient.invoice.delete({
            where: {
                id: id,
            },
        });
        res.status(204).json({});
    });
}
exports.deleteInvoiceById = deleteInvoiceById;
const invoiceRouter = (0, express_1.Router)();
exports.invoiceRouter = invoiceRouter;
invoiceRouter.post("/invoices", createInvoice);
invoiceRouter.post("/login", login);
invoiceRouter.get("/invoices", authorize_1.authorize, getInvoices);
invoiceRouter.get("/invoices/:id", authorize_1.authorize, getInvoiceById);
invoiceRouter.get("/invoices/regenerate/:id", authorize_1.authorize, regenerateInvoice);
invoiceRouter.delete("/invoices/:id", authorize_1.authorize, deleteInvoiceById);
//# sourceMappingURL=invoice.js.map