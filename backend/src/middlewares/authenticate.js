const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma/client');
const { AppError } = require('../utils/AppError');

async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) throw new AppError('Token não fornecido.', 401);
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id:true, name:true, email:true, role:true } });
    if (!user) throw new AppError('Usuário não encontrado.', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(new AppError('Token inválido.', 401));
    if (err.name === 'TokenExpiredError') return next(new AppError('Token expirado.', 401));
    next(err);
  }
}
module.exports = { authenticate };
