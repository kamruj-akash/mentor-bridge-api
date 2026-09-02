import multer from "multer";

const allowedFiles = new Set(["application/pdf", "image/jpeg", "image/png"]);

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedFiles.has(file.mimetype)) {
      return cb(new Error("Only PDF, JPEG and PNG files are allowed"));
    }
    cb(null, true);
  },
});
