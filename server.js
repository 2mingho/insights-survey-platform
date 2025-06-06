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

// Redirigir a HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/auth', authRouter);
app.use('/api/proyectos', proyectosRouter);
app.use('/api/encuestadores', encuestadoresRouter);

// Rutas públicas (HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/encuestador', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'encuestador.html'));
});

app.get('/about_us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about_us.html'));
});

app.get('/login_admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login_admin.html'));
});

// Vistas privadas (protegidas solo desde el frontend con token JWT)
app.get('/view_encuestadores', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view_encuestadores.html'));
});

app.get('/add_encuestadores', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_encuestadores.html'));
});

app.get('/edit_encuestador', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit_encuestador.html'));
});

app.get('/view_proyectos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'proyectos.html'));
});

app.get('/add_proyecto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add_proyecto.html'));
});

app.get('/edit_proyecto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit_proyecto.html'));
});

// Fallback para rutas no encontradas
app.get('*', (req, res) => {
  console.warn(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});