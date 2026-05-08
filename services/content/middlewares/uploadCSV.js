import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

// Storage for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter → ONLY CSV allowed
function csvFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
}

const uploadCSV = multer({
  storage: storage,
  fileFilter: csvFilter
});

export default uploadCSV;
