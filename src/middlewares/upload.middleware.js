import multer from "multer";
import path from "path";
import fs from "fs";

// папка для загрузки
const uploadDir = path.resolve("uploads");

// если нет папки — создаём
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // папка назначения
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // расширение (.jpg, .png)
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
