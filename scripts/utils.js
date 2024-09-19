import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function read_json(path) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}
export const ROOTDIR = path.resolve(__dirname, "../");
export const SRCDIR = path.resolve(ROOTDIR, "src");
export const OUTDIR = path.resolve(ROOTDIR, "out");
export const CONFIG = read_json(path.resolve(ROOTDIR, "./config.json"));

const mimeTypes = {
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".csv": "text/csv",
  ".ics": "text/calendar",
  ".js": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ts": "video/mp2t",
  ".jsx": "text/jsx",
  ".tsx": "text/tsx",
  ".yaml": "application/x-yaml",
  ".yml": "application/x-yaml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".eot": "application/vnd.ms-fontobject",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".m4a": "audio/mp4",
  ".weba": "audio/webm",
  ".mid": "audio/midi",
  ".midi": "audio/midi",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".avi": "video/x-msvideo",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".flv": "video/x-flv",
  ".wmv": "video/x-ms-wmv",
  ".mpg": "video/mpeg",
  ".mpeg": "video/mpeg",
  ".m4v": "video/x-m4v",
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".bz2": "application/x-bzip2",
  ".xz": "application/x-xz",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",
  ".iso": "application/x-iso9660-image",
  ".dmg": "application/x-apple-diskimage",
  ".pdf": "application/pdf",
  ".exe": "application/vnd.microsoft.portable-executable",
  ".bin": "application/octet-stream",
  ".msi": "application/x-msdownload",
  ".dll": "application/x-msdownload",
  ".deb": "application/x-debian-package",
  ".rpm": "application/x-rpm",
  ".bat": "application/x-msdos-program",
  ".sh": "application/x-sh",
  ".jar": "application/java-archive",
  ".rtf": "application/rtf",
  ".psd": "image/vnd.adobe.photoshop",
  ".ai": "application/postscript",
  ".eps": "application/postscript",
  ".dxf": "image/vnd.dxf",
  ".dwg": "image/vnd.dwg",
  ".kml": "application/vnd.google-earth.kml+xml",
  ".kmz": "application/vnd.google-earth.kmz",
  ".vcf": "text/vcard",
  ".ics": "text/calendar",
};

export function getMimeType(ext) {
  return mimeTypes[ext] || "application/octet-stream";
}