"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.invoiceSchema = zod_1.default.object({
    date: zod_1.default.string(),
    name: zod_1.default.string().min(3),
    lastname: zod_1.default.string().min(2),
    email: zod_1.default.string().email(),
    postalCode: zod_1.default.string().min(2),
    city: zod_1.default.string().min(2),
    street: zod_1.default.string().min(2),
    country: zod_1.default.string().min(2),
    currency: zod_1.default.enum(["EUR", "PLN"]),
    streetNumber: zod_1.default.string().min(1),
    housingNumber: zod_1.default.number().optional(),
    shoes: zod_1.default.array(zod_1.default.object({
        model: zod_1.default.string(),
        size: zod_1.default.number().min(1).max(70),
        price: zod_1.default.number().min(1),
        count: zod_1.default.number().min(1),
    })),
});
//# sourceMappingURL=schema.js.map