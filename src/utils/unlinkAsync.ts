import { promisify } from "util";
import { unlink } from "fs";

export const unlinkAsync = promisify(unlink);
