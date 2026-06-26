require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log('Hello World');
});