const { prisma } = require('../prisma/client');
class UserRepository {
  async create(data) { return prisma.user.create({ data }); }
  async findByEmail(email) { return prisma.user.findUnique({ where: { email } }); }
  async findById(id) { return prisma.user.findUnique({ where: { id } }); }
  async findAll(filter = {}, page = 1, limit = 20) {
    const where = {};
    if (filter.role) where.role = filter.role;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return { users: users.map(({ password, ...u }) => u), total, page, limit };
  }
  async update(id, data) { return prisma.user.update({ where: { id }, data }); }
  async delete(id) { return prisma.user.delete({ where: { id } }); }
}
module.exports = { UserRepository };
