const express = require('express');
const routes = require('./routes');

const server = express();
const port = 3000;
routes(server);

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = server;
