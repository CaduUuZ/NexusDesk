const { Router } = require('express');
const { listUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

const router = Router();

router.use(authenticate);
router.get('/', authorize('ADMIN'), listUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
