const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Phục vụ file tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static('uploads'));

// Trang chủ
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Xử lý upload file
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send(`File đã được tải lên thành công! <br>
              <a href="/uploads/${req.file.filename}" target="_blank">Xem file</a>`);
  } else {
    res.status(400).send('Có lỗi xảy ra khi tải file.');
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
