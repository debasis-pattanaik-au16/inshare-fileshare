const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1000000 * 100,
  },
}).single('myfile');

const uploadFiles = (req, res) => {
  // Store files
  upload(req, res, async err => {
    // Validate request
    if (!req.file) {
      res.status(404).json({
        status: 'failed',
        data: {
          message: 'All fields are required',
        },
      });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    // Store Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.status(200).json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
};

const sendAndReceiveEmail = async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  // Validate request
  if (!uuid || !emailTo || !emailFrom) {
    res.status(404).send({ error: 'All fields are required.' });
  }

  // Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    res.status(404).send({ error: 'Email already sent.' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send Email
  const sendMail = require('../services/emailService');
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'inShare file sharing',
    text: `${emailFrom} shared a file with you.`,
    html: require('../services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: file.size / 1000 + ' KB',
      expires: '24 hours',
    }),
  });
  return res.status(200).json({
    success: true,
  });
};

router.get('/', (req, res) => {
  res.render('fileUpload');
});
router.post('/', uploadFiles);
router.post('/send', sendAndReceiveEmail);

module.exports = router;
