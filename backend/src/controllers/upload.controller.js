const { UploadService } = require('../services/upload.service');

const uploadService = new UploadService();

async function uploadFile(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    const attachment = await uploadService.saveAttachment(req.file, req.user.id, req.body);
    return res.status(201).json(attachment);
  } catch (err) { next(err); }
}

module.exports = { uploadFile };
