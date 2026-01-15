// Chargement des variables d'environnement
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB dès le démarrage
connectDB();

// CORS: autoriser les appels depuis le front (ports Vite dynamiques par défaut)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:5177')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers JSON / urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de test
app.get('/', (req, res) => {
  res.status(200).json({
    message: ' Bienvenue dans l\'API Cosmetics E-Commerce !',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: '✅ API is healthy' });
});

// ============================================
// ROUTES DES RESSOURCES
// ============================================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '  Route non trouvée',
    path: req.path
  });
});

// Gestion d'erreur globale
app.use((error, req, res, next) => {
  console.error('  Erreur serveur :', error.message);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur serveur interne'
  });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
  console.log(`📡 Environnement : ${process.env.NODE_ENV}`);
});
