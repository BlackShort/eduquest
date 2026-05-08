import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

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
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default uploadAssignmentPDF;
