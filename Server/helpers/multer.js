import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory for quick access
const upload = multer({ storage }); // Middleware for handling file uploads

export default upload;
