const router = require('express').Router();
const fileController = require('./../controllers/fileController');

router.get('/', fileController.getFileuploadPage);
router.post('/', fileController.uploadFiles);
router.post('/send', fileController.sendAndReceiveEmail);

module.exports = router;
