const bcrypt = require('bcryptjs');
const { UserRepository } = require('../repositories/user.repository');
const { AppError } = require('../utils/AppError');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async findAll({ role, page = 1, limit = 20 }) {
    return this.userRepository.findAll({ role }, +page, +limit);
  }

  async findById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    const { password: _, ...u } = user;
    return u;
  }

  async update(id, data, requester) {
    if (requester.role !== 'ADMIN' && requester.id !== id) throw new AppError('Acesso negado.', 403);
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.update(id, data);
    const { password: _, ...u } = user;
    return u;
  }

  async delete(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    return this.userRepository.delete(id);
  }
}

module.exports = { UserService };
