const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, '../public/imagenes');
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, ['.jpg', '.jpeg', '.png'].includes(ext));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;