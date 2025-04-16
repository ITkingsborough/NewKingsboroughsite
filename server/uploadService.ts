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
    console.log('File field:', file.fieldname);
    
    let dest;
    // Determine destination directory based on the file fieldname
    if (file.fieldname === 'pdfFile') {
      dest = magazinesDir;
    } else if (file.fieldname === 'coverImage') {
      dest = magazinesDir;
    } else if (file.fieldname === 'image' || file.fieldname.includes('image')) {
      // Gallery images
      dest = galleryDir;
    } else if (file.fieldname === 'audioFile') {
      // Sermon audio files
      dest = sermonsDir;
    } else if (file.fieldname === 'banner') {
      // Event banners
      dest = eventsDir;
    } else {
      // Default fallback
      dest = uploadDir;
    }
    
    console.log('Destination directory:', dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const extension = path.extname(file.originalname);
    const filename = `${uuidv4()}${extension}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter to allow only images and pdfs
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('Filtering file:', file.fieldname, file.mimetype);
  
  // PDF files
  if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for PDF uploads'));
    }
    return;
  }
  
  // Image files
  if (file.fieldname === 'coverImage' || file.fieldname === 'image' || file.fieldname.includes('image') || file.fieldname === 'banner') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for image uploads'));
    }
    return;
  }
  
  // Audio files
  if (file.fieldname === 'audioFile') {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed for sermon uploads'));
    }
    return;
  }
  
  // Default - accept the file
  cb(null, true);
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