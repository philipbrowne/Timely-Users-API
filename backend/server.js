'use strict';

const app = require('./app');
const { PORT } = require('./config');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
