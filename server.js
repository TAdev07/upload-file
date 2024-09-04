const express = require('express');
const multer = require('multer');
const { uploadToExternalStorage } = require('./uploadService');

const app = express();
const port = process.env.PORT || 3000;

// Sử dụng memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Trang chủ
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Xử lý upload file
app.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file) {
    try {
      const fileUrl = await uploadToExternalStorage(req.file);
      res.send(`File đã được tải lên thành công! <br>
                <a href="${fileUrl}" target="_blank">Xem file</a>`);
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      res.status(500).send('Có lỗi xảy ra khi tải file lên storage.');
    }
  } else {
    res.status(400).send('Không có file được gửi lên.');
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
