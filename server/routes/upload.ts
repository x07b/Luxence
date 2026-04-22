import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// MIME type to extension mapping
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}

ensureUploadDir();

export async function uploadFile(req: any, res: any) {
  try {
    // Handle file from fetch with FormData
    const contentType = (req.get("content-type") || "").toLowerCase();
    let filename = req.get("x-filename") || "";

    // Allowed MIME types
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/octet-stream",
    ];

    const isValidContentType = allowedMimes.some((mime) =>
      contentType.startsWith(mime),
    );

    if (!isValidContentType) {
      res.status(400).json({ error: "Invalid content type" });
      return;
    }

    // Determine file extension
    let fileExt = "";

    // Try to get extension from filename header
    if (filename) {
      fileExt = path.extname(filename).toLowerCase();
    }

    // If no extension from filename, derive from content-type
    if (!fileExt && contentType) {
      const baseType = contentType.split(";")[0].trim();
      fileExt = MIME_EXTENSIONS[baseType] || ".bin";
    }

    // Validate file extension
    const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
    if (!allowedExts.includes(fileExt.toLowerCase())) {
      res.status(400).json({ error: "File type not allowed" });
      return;
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${fileExt}`;
    const filepath = path.join(UPLOAD_DIR, uniqueFilename);

    // Collect file chunks
    const chunks: Buffer[] = [];
    let fileSize = 0;

    req.on("data", (chunk: Buffer) => {
      fileSize += chunk.length;
      if (fileSize > MAX_FILE_SIZE) {
        res.status(413).json({ error: "File too large" });
        req.pause();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", async () => {
      try {
        const fileBuffer = Buffer.concat(chunks);

        // Use async write to avoid blocking event loop
        await fs.writeFile(filepath, fileBuffer);

        const fileUrl = `/uploads/${uniqueFilename}`;
        res.json({
          success: true,
          filename: uniqueFilename,
          url: fileUrl,
          originalName: filename || uniqueFilename,
        });
      } catch (error) {
        console.error("Upload file write error:", error);
        res.status(500).json({ error: "Failed to save file" });
      }
    });

    req.on("error", (error: Error) => {
      console.error("Upload stream error:", error);
      res.status(500).json({ error: "Upload failed" });
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
