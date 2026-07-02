require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();

// Middlewares globales
app.use(helmet());
app.use(express.json());

// Conectar Base de Datos
connectDB();

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Autenticación Centralizada funcionando 🚀' });
});

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});