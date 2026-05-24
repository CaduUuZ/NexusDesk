const { TicketService } = require('../services/ticket.service');

const ticketService = new TicketService();

async function createTicket(req, res, next) {
  try {
    const { title, description, priority } = req.body;
    const ticket = await ticketService.create({ title, description, priority, userId: req.user.id });
    return res.status(201).json(ticket);
  } catch (err) { next(err); }
}

async function listTickets(req, res, next) {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const tickets = await ticketService.findAll({ user: req.user, status, priority, page: +page, limit: +limit });
    return res.json(tickets);
  } catch (err) { next(err); }
}

async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.findById(req.params.id, req.user);
    return res.json(ticket);
  } catch (err) { next(err); }
}

async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketService.update(req.params.id, req.body, req.user);
    return res.json(ticket);
  } catch (err) { next(err); }
}

async function deleteTicket(req, res, next) {
  try {
    await ticketService.delete(req.params.id);
    return res.status(204).send();
  } catch (err) { next(err); }
}

async function assignTicket(req, res, next) {
  try {
    const ticket = await ticketService.assign(req.params.id, req.body.technicianId);
    return res.json(ticket);
  } catch (err) { next(err); }
}

async function getDashboard(req, res, next) {
  try {
    const data = await ticketService.getDashboardStats();
    return res.json(data);
  } catch (err) { next(err); }
}

module.exports = { createTicket, listTickets, getTicket, updateTicket, deleteTicket, assignTicket, getDashboard };
