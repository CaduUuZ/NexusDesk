const { prisma } = require('../prisma/client');
class NotificationRepository {
  async create(data) { return prisma.notification.create({ data }); }
  async findByUser(userId) {
    return prisma.notification.findMany({ where:{userId}, orderBy:{createdAt:'desc'}, take:50 });
  }
  async markAsRead(id) { return prisma.notification.update({ where:{id}, data:{read:true} }); }
  async markAllAsRead(userId) { return prisma.notification.updateMany({ where:{userId,read:false}, data:{read:true} }); }
}
module.exports = { NotificationRepository };
