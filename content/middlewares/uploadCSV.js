const multer = require("multer");
const path = require("path");

// Storage for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

module.exports = uploadCSV;
