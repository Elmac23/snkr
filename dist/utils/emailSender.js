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
exports.sendInvoice = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const EMAILSERVER = process.env.EMAILSERVER;
const EMAILPORT = process.env.EMAILPORT;
const SSL = process.env.SSL === "true" ? true : false;
const PRIVATEMAIL = process.env.PRIVATEMAIL;
function sendInvoice(recipent, invoicePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            host: EMAILSERVER,
            port: +EMAILPORT,
            secure: SSL,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: EMAIL,
                pass: PASSWORD,
            },
        });
        let info = yield transporter.sendMail({
            from: `${EMAIL} SNEAKERMAN.SHOP`,
            to: [
                {
                    address: recipent,
                    name: "Sprzedawca",
                },
                {
                    address: PRIVATEMAIL,
                    name: "Kupujący",
                },
            ],
            subject: "UMOWA KUPNA SPRZEDAŻY",
            text: "test",
            html: "<b>UMOWA KUPNA SPRZEDAŻY</b>",
            attachments: [
                {
                    path: invoicePath,
                },
            ],
        });
        return info;
    });
}
exports.sendInvoice = sendInvoice;
//# sourceMappingURL=emailSender.js.map