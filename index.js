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

// Solo levantar el servidor con app.listen si NO estamos en el entorno de Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// CRUCIAL: Exportar app para que Vercel Serverless pueda leerlo
module.exports = app;