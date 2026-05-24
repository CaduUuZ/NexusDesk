const { Router } = require('express');
const {
  createTicket, listTickets, getTicket,
  updateTicket, deleteTicket, assignTicket, getDashboard
} = require('../controllers/ticket.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

const router = Router();

router.use(authenticate);
router.get('/dashboard', authorize('ADMIN', 'TECHNICIAN'), getDashboard);
router.post('/', createTicket);
router.get('/', listTickets);
router.get('/:id', getTicket);
router.patch('/:id', updateTicket);
router.delete('/:id', authorize('ADMIN'), deleteTicket);
router.patch('/:id/assign', authorize('ADMIN'), assignTicket);

module.exports = router;
