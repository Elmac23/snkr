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
exports.prismaClient = void 0;
const server_js_1 = require("./utils/server.js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const client_1 = require("@prisma/client");
const server = (0, server_js_1.createServer)();
exports.prismaClient = new client_1.PrismaClient();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.prismaClient.$connect();
            server.listen(PORT, () => {
                console.log(`Listening on port: ${PORT}`);
            });
        }
        catch (e) {
            console.log(e);
            exports.prismaClient.$disconnect();
        }
        finally {
        }
    });
}
run();
//# sourceMappingURL=main.js.map