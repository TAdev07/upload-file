const express = require('express');
const multer = require('multer');
const axios = require('axios');
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
      const fileInfo = await uploadToExternalStorage(req.file);
      res.json({
        message: 'File đã được tải lên thành công!',
        fileUrl: `/file/${fileInfo.publicId}`, // Sử dụng publicId thay vì URL trực tiếp
        fileFormat: fileInfo.format,
        fileType: fileInfo.resourceType
      });
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      res.status(500).json({ error: 'Có lỗi xảy ra khi tải file lên storage.' });
    }
  } else {
    res.status(400).json({ error: 'Không có file được gửi lên.' });
  }
});

app.get('/file/:publicId', async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const fileInfo = await getFileInfo(publicId);
    if (fileInfo) {
      const response = await axios({
        method: 'get',
        url: fileInfo.url,
        responseType: 'arraybuffer'
      });

      res.setHeader('Content-Type', fileInfo.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.filename}"`);
      res.send(Buffer.from(response.data, 'binary'));
    } else {
      res.status(404).send('File không tồn tại');
    }
  } catch (error) {
    console.error('Lỗi khi lấy file:', error);
    res.status(500).send('Có lỗi xảy ra khi lấy file');
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});

// Hàm giả định để lấy thông tin file
async function getFileInfo(publicId) {
  // Trong thực tế, bạn sẽ cần truy vấn database hoặc storage service để lấy thông tin này
  // Đây chỉ là ví dụ
  return {
    url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filename: `file_${publicId}.xlsx`
  };
}

