const AttachmentService = require('../services/attachment.service');

class AttachmentController {
  async list(req, res, next) {
    try {
      const attachments = await AttachmentService.list(req.params.ticketId);
      res.json(attachments);
    } catch (err) { next(err); }
  }

  async upload(req, res, next) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      const attachment = await AttachmentService.save(req.params.ticketId, req.file, req.user.id);
      res.status(201).json(attachment);
    } catch (err) { next(err); }
  }

  async remove(req, res, next) {
    try {
      await AttachmentService.remove(req.params.attachmentId, req.user);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

module.exports = new AttachmentController();
