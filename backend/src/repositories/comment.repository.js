const { prisma } = require('../prisma/client');
class CommentRepository {
  async create(data) {
    return prisma.comment.create({ data, include:{ user:{select:{id:true,name:true,role:true}}, attachments:true } });
  }
  async findById(id) { return prisma.comment.findUnique({ where:{id} }); }
  async findByTicket(ticketId) {
    return prisma.comment.findMany({ where:{ticketId}, include:{ user:{select:{id:true,name:true,role:true}}, attachments:true }, orderBy:{createdAt:'asc'} });
  }
  async delete(id) { return prisma.comment.delete({ where:{id} }); }
}
module.exports = { CommentRepository };
