import multer from "multer";

const storage = multer.memoryStorage();

const resumeFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and DOC/DOCX are allowed."), false);
  }
};

export const resumeUpload = multer({
  storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
