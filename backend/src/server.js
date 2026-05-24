require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { setupSocket } = require('./socket');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');

const app = express();
const server = http.createServer(app);

setupSocket(server);

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`🚀 NexusDesk API rodando na porta ${PORT}`);
});

module.exports = { app, server };
