import { createServer } from "./utils/server.js";
import { createServer as createHttpsServer } from "https";
import { readFileSync } from "fs";
import { config } from "dotenv";
config();
const PORT = process.env.PORT;

const server = createServer();
const sslServer = createHttpsServer(
  {
    key: readFileSync("./cert/key.pem"),
    cert: readFileSync("./cert/cert.pem"),
  },
  server
);
async function run() {
  try {
    sslServer.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  } finally {
  }
}
run();
