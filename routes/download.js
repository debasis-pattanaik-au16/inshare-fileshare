const router = require('express').Router();
const downloadController = require('./../controllers/downloadController');

router.get('/:uuid', downloadController.downloadFile);

module.exports = router;
