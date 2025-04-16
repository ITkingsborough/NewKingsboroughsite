import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const galleryDir = path.join(uploadDir, 'gallery');
const sermonsDir = path.join(uploadDir, 'sermons');
const eventsDir = path.join(uploadDir, 'events');
const magazinesDir = path.join(uploadDir, 'magazines');

// Make sure directories exist
for (const dir of [uploadDir, galleryDir, sermonsDir, eventsDir, magazinesDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.uploadType || 'gallery';
    let dest;
    
    switch (uploadType) {
      case 'gallery':
        dest = galleryDir;
        break;
      case 'sermon':
        dest = sermonsDir;
        break;
      case 'event':
        dest = eventsDir;
        break;
      case 'magazine':
        dest = magazinesDir;
        break;
      default:
        dest = uploadDir;
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const extension = path.extname(file.originalname);
    const filename = `${uuidv4()}${extension}`;
    cb(null, filename);
  }
});

// File filter to allow only images and pdfs
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if this is PDF upload for magazines
  if (req.body.uploadType === 'magazine' && file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for magazines'));
    }
    return;
  }

  // For images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Set up multer with configured storage
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter,
});

// Function to get public URL for uploaded files
export function getPublicUrl(filename: string, type: string = 'gallery'): string {
  return `/uploads/${type}/${filename}`;
}

// Function to delete a file
export function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Only delete if file exists and is within uploads directory
    if (filePath.includes('/uploads/') && fs.existsSync(path.join(process.cwd(), 'public', filePath))) {
      fs.unlink(path.join(process.cwd(), 'public', filePath), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      // If file doesn't exist or not in uploads directory, just resolve
      resolve();
    }
  });
}