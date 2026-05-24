const { AuthService } = require('../services/auth.service');

const authService = new AuthService();

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  return res.json(req.user);
}

module.exports = { register, login, me };
