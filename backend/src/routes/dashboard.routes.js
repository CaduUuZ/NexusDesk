const { Router } = require('express');
const DashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/authorize.middleware');

const router = Router();

router.use(authenticate);
router.get('/stats', authorize('ADMIN', 'TECHNICIAN'), DashboardController.stats);
router.get('/sla', authorize('ADMIN', 'TECHNICIAN'), DashboardController.sla);
router.get('/technicians', authorize('ADMIN'), DashboardController.technicians);

module.exports = router;
