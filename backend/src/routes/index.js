const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const ticketRoutes = require('./ticket.routes');
const commentRoutes = require('./comment.routes');
const notificationRoutes = require('./notification.routes');
const uploadRoutes = require('./upload.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'NexusDesk API' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/tickets', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
