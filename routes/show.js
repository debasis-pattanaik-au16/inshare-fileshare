const router = require('express').Router();
const showController = require('./../controllers/showController');

router.get('/:uuid', showController.showDownloadLink);

module.exports = router;
