import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

function pdfFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf" && file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
}

const uploadAssignmentPDF = multer({
  storage,
  fileFilter: pdfFilter,
});

export default uploadAssignmentPDF;
