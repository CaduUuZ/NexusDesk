const path = require('path');
const { prisma } = require('../prisma/client');

class UploadService {
  async saveAttachment(file, uploadedBy, body) {
    const attachment = await prisma.attachment.create({
      data: {
        fileUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy,
        ticketId: body.ticketId || null,
        commentId: body.commentId || null,
      },
    });
    return attachment;
  }
}

module.exports = { UploadService };
