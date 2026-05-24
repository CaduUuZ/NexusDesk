const { CommentService } = require('../services/comment.service');

const commentService = new CommentService();

async function createComment(req, res, next) {
  try {
    const comment = await commentService.create({
      message: req.body.message,
      ticketId: req.params.ticketId,
      userId: req.user.id,
    });
    return res.status(201).json(comment);
  } catch (err) { next(err); }
}

async function listComments(req, res, next) {
  try {
    const comments = await commentService.findByTicket(req.params.ticketId, req.user);
    return res.json(comments);
  } catch (err) { next(err); }
}

async function deleteComment(req, res, next) {
  try {
    await commentService.delete(req.params.commentId, req.user);
    return res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { createComment, listComments, deleteComment };
