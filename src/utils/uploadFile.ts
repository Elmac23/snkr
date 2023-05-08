import path from "path";
import { BadRequestError } from "./Errors/BadRequestError";
import { v4 as uuid } from "uuid";
import { UploadedFile } from "express-fileupload";

export type uploadFileOptions = {
  amount?: "single" | "multiple";
};

export async function uploadFile(
  file?: UploadedFile | UploadedFile[],
  options: uploadFileOptions = {},
  filePath: string = "./public/"
) {
  if (!file) {
    throw new BadRequestError("File not found!");
  }
  if (Array.isArray(file)) {
    if (options.amount === "single") {
      throw new BadRequestError("Expected multiple files!");
    }
    const fileNames: string[] = [];
    file.forEach(async (f) => {
      const format = f.name.split(".")[1];
      const imageId = uuid();
      const newName = `${imageId}.${format}`;
      await f.mv(path.resolve(filePath, newName));
      fileNames.push(newName);
    });
    return fileNames;
  } else {
    if (options.amount === "multiple") {
      throw new BadRequestError("Expected single file!");
    }
    const format = file.name.split(".")[1];
    const imageId = uuid();
    const newName = `${imageId}.${format}`;
    await file.mv(path.resolve(filePath, newName));
    return newName;
  }
}
