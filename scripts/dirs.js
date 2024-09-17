import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOTDIR = path.resolve(__dirname, "../");
export const SRCDIR = path.resolve(ROOTDIR, "src");
export const OUTDIR = path.resolve(ROOTDIR, "out");

