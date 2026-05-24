const { CommentRepository } = require('../repositories/comment.repository');
const { TicketRepository } = require('../repositories/ticket.repository');
const { NotificationService } = require('./notification.service');
const { AppError } = require('../utils/AppError');

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
    this.ticketRepository = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  async create({ message, ticketId, userId }) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);

    const comment = await this.commentRepository.create({ message, ticketId, userId });

    if (ticket.userId !== userId) {
      await this.notificationService.create({
        userId: ticket.userId,
        ticketId,
        message: `Novo comentário no chamado "${ticket.title}".`,
      });
    }
    return comment;
  }

  async findByTicket(ticketId, user) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);
    if (user.role === 'USER' && ticket.userId !== user.id) throw new AppError('Acesso negado.', 403);
    return this.commentRepository.findByTicket(ticketId);
  }

  async delete(commentId, user) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new AppError('Comentário não encontrado.', 404);
    if (user.role !== 'ADMIN' && comment.userId !== user.id) throw new AppError('Acesso negado.', 403);
    return this.commentRepository.delete(commentId);
  }
}

module.exports = { CommentService };
