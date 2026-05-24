const { NotificationService } = require('../services/notification.service');

const notificationService = new NotificationService();

async function listNotifications(req, res, next) {
  try {
    const notifications = await notificationService.findByUser(req.user.id);
    return res.json(notifications);
  } catch (err) { next(err); }
}

async function markAsRead(req, res, next) {
  try {
    const n = await notificationService.markAsRead(req.params.id, req.user.id);
    return res.json(n);
  } catch (err) { next(err); }
}

async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { listNotifications, markAsRead, markAllAsRead };
