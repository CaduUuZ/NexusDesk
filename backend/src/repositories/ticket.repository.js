const { prisma } = require('../prisma/client');
const inc = {
  creator: { select: { id:true, name:true, email:true, role:true } },
  assignee: { select: { id:true, name:true, email:true, role:true } },
  _count: { select: { comments:true, attachments:true } },
};
class TicketRepository {
  async create(data) { return prisma.ticket.create({ data, include: inc }); }
  async findAll(filter={}, page=1, limit=20) {
    const where = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.assignedTo) where.assignedTo = filter.assignedTo;
    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({ where, include: inc, skip:(page-1)*limit, take:limit, orderBy:{ createdAt:'desc' } }),
      prisma.ticket.count({ where }),
    ]);
    return { tickets, total, page, limit };
  }
  async findById(id) {
    return prisma.ticket.findUnique({
      where: { id },
      include: { ...inc, comments: { include: { user: { select:{id:true,name:true,role:true} }, attachments:true }, orderBy:{createdAt:'asc'} }, attachments:true },
    });
  }
  async update(id, data) {
    if (data.status === 'CLOSED' || data.status === 'RESOLVED') data.closedAt = new Date();
    return prisma.ticket.update({ where:{id}, data, include:inc });
  }
  async delete(id) { return prisma.ticket.delete({ where:{id} }); }
  async getDashboardStats() {
    const [total, open, inProgress, resolved, closed, byPriority] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where:{status:'OPEN'} }),
      prisma.ticket.count({ where:{status:'IN_PROGRESS'} }),
      prisma.ticket.count({ where:{status:'RESOLVED'} }),
      prisma.ticket.count({ where:{status:'CLOSED'} }),
      prisma.ticket.groupBy({ by:['priority'], _count:true }),
    ]);
    return { total, open, inProgress, resolved, closed, byPriority };
  }
}
module.exports = { TicketRepository };
