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
const server_js_1 = require("./utils/server.js");
const https_1 = require("https");
const fs_1 = require("fs");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const server = (0, server_js_1.createServer)();
const sslServer = (0, https_1.createServer)({
    key: (0, fs_1.readFileSync)("./cert/key.pem"),
    cert: (0, fs_1.readFileSync)("./cert/cert.pem"),
}, server);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            sslServer.listen(PORT, () => {
                console.log(`Listening on port: ${PORT}`);
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
        }
    });
}
run();
//# sourceMappingURL=main.js.map