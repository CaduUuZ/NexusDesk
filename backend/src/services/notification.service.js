const { NotificationRepository } = require('../repositories/notification.repository');

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async create({ userId, ticketId, message }) {
    return this.notificationRepository.create({ userId, ticketId, message });
  }

  async findByUser(userId) {
    return this.notificationRepository.findByUser(userId);
  }

  async markAsRead(id, userId) {
    return this.notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId) {
    return this.notificationRepository.markAllAsRead(userId);
  }
}

module.exports = { NotificationService };
