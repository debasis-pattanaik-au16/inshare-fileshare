const multer = require('multer');
const File = require('../models/file');
const AWS = require('aws-sdk/clients/s3');
const { v4: uuid4 } = require('uuid');

const s3 = new AWS({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_BUCKET_REGION,
});

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
});

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1000000 * 100,
  },
}).single('myfile');

exports.uploadFiles = (req, res) => {
  // Store files
  upload(req, res, async err => {
    let myfile = req.file.originalname.split('.');
    const fileType = myfile[myfile.length - 1];

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

    // Storing in AWS S3 Bucket
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuid4()}.${fileType}`,
      Body: req.file.buffer,
      ACL: 'public-read',
    };

    s3.upload(params, async (error, data) => {
      if (error) {
        res.status(500).send(error);
      }
      // Store Database
      const file = new File({
        filename: req.file.originalname,
        uuid: uuid4(),
        path: data.Location,
        size: req.file.size,
      });
      const response = await file.save();
      return res.status(200).json({
        file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
      });
    });
  });
};

exports.sendAndReceiveEmail = async (req, res) => {
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

exports.getFileuploadPage = (req, res) => {
  res.render('fileUpload');
};
