const { Router } = require('express');
const { createComment, listComments, deleteComment } = require('../controllers/comment.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = Router();

router.use(authenticate);
router.post('/:ticketId/comments', createComment);
router.get('/:ticketId/comments', listComments);
router.delete('/:ticketId/comments/:commentId', deleteComment);

module.exports = router;
