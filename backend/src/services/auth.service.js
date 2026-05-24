const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserRepository } = require('../repositories/user.repository');
const { AppError } = require('../utils/AppError');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register({ name, email, password, role }) {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw new AppError('Email já cadastrado.', 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashed, role });

    const token = this._generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('Credenciais inválidas.', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('Credenciais inválidas.', 401);

    const token = this._generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = { AuthService };
