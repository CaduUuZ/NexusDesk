const { Router } = require('express');
const { uploadFile } = require('../controllers/upload.controller');
const { authenticate } = require('../middlewares/authenticate');
const { upload } = require('../middlewares/multer');

const router = Router();

router.use(authenticate);
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
