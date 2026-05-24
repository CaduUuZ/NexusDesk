const prisma = require('../utils/prisma');

class DashboardService {
  async stats() {
    const [total, open, inProgress, resolved, closed, critical] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'RESOLVED' } }),
      prisma.ticket.count({ where: { status: 'CLOSED' } }),
      prisma.ticket.count({ where: { priority: 'CRITICAL', status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    ]);

    const resolvedToday = await prisma.ticket.count({
      where: {
        status: 'RESOLVED',
        updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    return { total, open, inProgress, resolved, closed, critical, resolvedToday };
  }

  async sla() {
    const now = new Date();
    const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const result = {};

    for (const priority of priorities) {
      const total = await prisma.ticket.count({
        where: { priority, status: { in: ['OPEN', 'IN_PROGRESS', 'RESOLVED'] } },
      });
      const onTime = await prisma.ticket.count({
        where: {
          priority,
          status: { in: ['OPEN', 'IN_PROGRESS', 'RESOLVED'] },
          slaDeadline: { gt: now },
        },
      });
      result[priority] = total > 0 ? Math.round((onTime / total) * 100) : 100;
    }

    return result;
  }

  async technicians() {
    const techs = await prisma.user.findMany({
      where: { role: { in: ['TECHNICIAN', 'ADMIN'] } },
      select: {
        id: true, name: true,
        assignedTickets: {
          select: { id: true, status: true },
        },
      },
    });

    return techs.map(t => ({
      id: t.id,
      name: t.name,
      total: t.assignedTickets.length,
      resolved: t.assignedTickets.filter(tk => tk.status === 'RESOLVED').length,
      open: t.assignedTickets.filter(tk => ['OPEN', 'IN_PROGRESS'].includes(tk.status)).length,
    })).sort((a, b) => b.total - a.total);
  }
}

module.exports = new DashboardService();
