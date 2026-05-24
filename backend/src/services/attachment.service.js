const path = require('path');
const prisma = require('../utils/prisma');

class AttachmentService {
  async list(ticketId) {
    return prisma.attachment.findMany({
      where: { ticketId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async save(ticketId, file, userId) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw Object.assign(new Error('Ticket não encontrado'), { status: 404 });

    const fileUrl = `/uploads/${file.filename}`;

    return prisma.attachment.create({
      data: {
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        ticketId,
        uploadedBy: userId,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async remove(attachmentId, authUser) {
    const att = await prisma.attachment.findUnique({ where: { id: attachmentId } });
    if (!att) throw Object.assign(new Error('Anexo não encontrado'), { status: 404 });

    if (authUser.role !== 'ADMIN' && att.uploadedBy !== authUser.id)
      throw Object.assign(new Error('Acesso negado'), { status: 403 });

    await prisma.attachment.delete({ where: { id: attachmentId } });
  }
}

module.exports = new AttachmentService();
