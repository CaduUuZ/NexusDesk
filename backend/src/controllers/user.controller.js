const { UserService } = require('../services/user.service');

const userService = new UserService();

async function listUsers(req, res, next) {
  try {
    const users = await userService.findAll(req.query);
    return res.json(users);
  } catch (err) { next(err); }
}

async function getUser(req, res, next) {
  try {
    const user = await userService.findById(req.params.id);
    return res.json(user);
  } catch (err) { next(err); }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body, req.user);
    return res.json(user);
  } catch (err) { next(err); }
}

async function deleteUser(req, res, next) {
  try {
    await userService.delete(req.params.id);
    return res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { listUsers, getUser, updateUser, deleteUser };
