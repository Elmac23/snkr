import { createServer } from "./utils/server.js";
import { createServer as createHttpsServer } from "https";
import { readFileSync } from "fs";
import { config } from "dotenv";
config();
const PORT = process.env.PORT;

import { PrismaClient } from "@prisma/client";
const server = createServer();
// const sslServer = createHttpsServer(
//   {
//     key: readFileSync("./cert/key.pem"),
//     cert: readFileSync("./cert/cert.pem"),
//     rejectUnauthorized: false,
//     requestCert: true,
//   },
//   server
// );
export const prismaClient = new PrismaClient();
async function run() {
  try {
    prismaClient.$connect();
    server.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
    prismaClient.$disconnect();
  } finally {
  }
}
run();
