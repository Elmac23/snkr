import "express-async-errors";
import express, { Router } from "express";
import morgan from "morgan";
import { errorHandling } from "../middleware/errorHandling.js";
import { notFound } from "../middleware/notFound.js";
import { invoiceRouter } from "../invoice/invoice.js";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import cors from "cors";
import { fileFormatRestriction } from "../middleware/fileFormatRestriction.js";
export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  );
  app.use(fileFormatRestriction("png"));
  app.use(morgan("dev"));
  app.use("/", invoiceRouter);
  app.use(express.static("public"));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
  });
  app.use(notFound);
  app.use(errorHandling);

  return app;
}
