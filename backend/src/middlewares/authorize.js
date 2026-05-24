const { AppError } = require('../utils/AppError');

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) throw new AppError('Acesso não autorizado.', 403);
    next();
  };
}
module.exports = { authorize };
