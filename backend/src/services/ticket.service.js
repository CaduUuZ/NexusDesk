const { TicketRepository } = require('../repositories/ticket.repository');
const { NotificationService } = require('./notification.service');
const { AppError } = require('../utils/AppError');

class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  async create({ title, description, priority, userId }) {
    const ticket = await this.ticketRepository.create({ title, description, priority, userId });
    return ticket;
  }

  async findAll({ user, status, priority, page, limit }) {
    const filter = {};
    if (user.role === 'USER') filter.userId = user.id;
    if (user.role === 'TECHNICIAN') filter.assignedTo = user.id;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    return this.ticketRepository.findAll(filter, page, limit);
  }

  async findById(id, user) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);
    if (user.role === 'USER' && ticket.userId !== user.id) throw new AppError('Acesso negado.', 403);
    return ticket;
  }

  async update(id, data, user) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);
    if (user.role === 'USER' && ticket.userId !== user.id) throw new AppError('Acesso negado.', 403);

    const updated = await this.ticketRepository.update(id, data);

    if (data.status) {
      await this.notificationService.create({
        userId: ticket.userId,
        ticketId: id,
        message: `Chamado "${ticket.title}" atualizado para ${data.status}.`,
      });
    }
    return updated;
  }

  async delete(id) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);
    return this.ticketRepository.delete(id);
  }

  async assign(id, technicianId) {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new AppError('Chamado não encontrado.', 404);
    const updated = await this.ticketRepository.update(id, {
      assignedTo: technicianId,
      status: 'IN_PROGRESS',
    });
    await this.notificationService.create({
      userId: ticket.userId,
      ticketId: id,
      message: `Seu chamado "${ticket.title}" foi atribuído a um técnico.`,
    });
    return updated;
  }

  async getDashboardStats() {
    return this.ticketRepository.getDashboardStats();
  }
}

module.exports = { TicketService };
