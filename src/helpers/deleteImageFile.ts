import path from "node:path";
import fs from "node:fs";

export function deleteImageFile(filename: string) {
  const fullPath = path.join(__dirname, "..", "..", "uploads", filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
