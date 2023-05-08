import { createServer } from "./utils/server.js";
import { config } from "dotenv";
config();
const PORT = process.env.PORT;

const server = createServer();
async function run() {
  try {
    server.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  } finally {
  }
}
run();
