const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const proyectosRouter = require('./routes/proyectos');
const encuestadoresRouter = require('./routes/encuestadores');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/auth', authRouter);
app.use('/api/proyectos', proyectosRouter);
app.use('/api/encuestadores', encuestadoresRouter);

// Rutas frontend específicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login_admin.html'));
});

app.get('/encuestador', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'encuestador.html'));
});

// Fallback para otras rutas
app.get('*', (req, res) => {
  console.warn(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});