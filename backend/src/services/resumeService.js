import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../lib/env.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

/**
 * Processes an uploaded resume file:
 * - Uploads to Cloudinary
 * - Extracts text from PDF using pdf-parse
 * @param {Object} file - Multer file object (buffer)
 * @returns {{ url: string, extractedText: string, filename: string }}
 */
export async function processResume(file) {
  // 1. Extract text first (local processing since we have the buffer)
  let extractedText = "";
  if (file.mimetype === "application/pdf") {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(file.buffer);
      extractedText = pdfData.text || "";
      console.log(`✅ Resume text extracted: ${extractedText.length} characters`);
    } catch (err) {
      console.error("⚠️ PDF text extraction failed:", err.message);
    }
  }

  // 2. Upload to Cloudinary
  return new Promise((resolve, reject) => {
    // Generate a safe unique filename keeping the extension
    const safeFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "talent_iq_resumes",
        resource_type: "raw", // Required for documents (PDF/DOCX) to download correctly
        public_id: safeFilename,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          // If cloudinary fails, we'll try to return the extracted text at least, 
          // or just reject if we strictly need the URL.
          return reject(new Error("Failed to upload resume to cloud storage"));
        }

        console.log("✅ Resume uploaded to Cloudinary:", result.secure_url);
        
        resolve({
          url: result.secure_url,
          extractedText: extractedText.slice(0, 5000), // Cap for AI context
          filename: file.originalname,
        });
      }
    );

    // Send the buffer to Cloudinary
    uploadStream.end(file.buffer);
  });
}
