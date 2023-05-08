import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import _ from "lodash";
import { BadRequestError } from "../utils/Errors/BadRequestError";

function checkFormat(fileName: string, acceptedFormats: string[]) {
  const format = fileName.split(".")[1];
  if (!acceptedFormats.includes(format)) {
    throw new BadRequestError(`${format} isn't a supported file format!`);
  }
}

export function fileFormatRestriction(acceptedFormats: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const correctFormats = acceptedFormats.split(" ");
    const files = req.files;
    if (!files) {
      return next();
    }
    for (const key in files) {
      const file = files[key];
      if (Array.isArray(file)) {
        file.forEach(({ name }) => {
          checkFormat(name, correctFormats);
        });
      } else {
        checkFormat(file.name, correctFormats);
      }
    }
    next();
  };
}
