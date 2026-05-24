const { Router } = require('express');
const AttachmentController = require('../controllers/attachment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

router.use(authenticate);
router.get('/:ticketId/attachments', AttachmentController.list);
router.post('/:ticketId/attachments', upload.single('file'), AttachmentController.upload);
router.delete('/:ticketId/attachments/:attachmentId', AttachmentController.remove);

module.exports = router;
