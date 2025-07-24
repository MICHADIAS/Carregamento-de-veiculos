require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const recargaRoutes = require('./routes/recargaRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');

// Middlewares para body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Views rendering
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/recarga', (req, res) => res.sendFile(path.join(__dirname, 'views', 'recarga.html')));
app.get('/api/recargas/iniciadas', (req, res) => {
  // Lógica para retornar as recargas iniciadas
});

// Rotas API
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/recargas', recargaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
