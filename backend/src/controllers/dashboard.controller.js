const DashboardService = require('../services/dashboard.service');

class DashboardController {
  async stats(req, res, next) {
    try {
      const stats = await DashboardService.stats();
      res.json(stats);
    } catch (err) { next(err); }
  }

  async sla(req, res, next) {
    try {
      const sla = await DashboardService.sla();
      res.json(sla);
    } catch (err) { next(err); }
  }

  async technicians(req, res, next) {
    try {
      const data = await DashboardService.technicians();
      res.json(data);
    } catch (err) { next(err); }
  }
}

module.exports = new DashboardController();
