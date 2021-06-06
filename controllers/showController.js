const File = require('../models/file');

exports.showDownloadLink = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      res.status(404).render('download', {
        error: 'Link has been expired',
      });
    }
    return res.status(200).render('download', {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    res.status(404).render('download', {
      error: 'something went wrong',
    });
  }
};
