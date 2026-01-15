/**
 * Script d'export des données MongoDB vers CSV pour Power BI
 * 
 * Ce script exporte toutes les collections importantes de la base de données
 * dans des fichiers CSV compatibles avec Power BI Desktop.
 * 
 * Usage: node scripts/exportDataForPowerBI.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Importer les modèles
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Review = require('../models/Review');
const Category = require('../models/Category');

// Configuration
const EXPORT_DIR = path.join(__dirname, '../powerbi-exports');

// Fonction pour créer le dossier d'export s'il n'existe pas
function ensureExportDirExists() {
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    console.log(`📁 Dossier d'export créé: ${EXPORT_DIR}`);
  }
}

// Fonction pour convertir un objet en ligne CSV
function objectToCSVLine(obj, headers) {
  return headers.map(header => {
    let value = obj[header];
    
    // Gérer les valeurs null/undefined
    if (value === null || value === undefined) {
      return '';
    }
    
    // Gérer les dates
    if (value instanceof Date) {
      return value.toISOString();
    }
    
    // Gérer les ObjectId
    if (value && value.toString && mongoose.Types.ObjectId.isValid(value)) {
      return value.toString();
    }
    
    // Convertir en string et échapper les guillemets
    value = String(value).replace(/"/g, '""');
    
    // Entourer de guillemets si contient virgule, retour ligne ou guillemets
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      return `"${value}"`;
    }
    
    return value;
  }).join(',');
}

// Fonction pour exporter une collection vers CSV
async function exportToCSV(Model, filename, fields) {
  try {
    console.log(`\n📊 Export de ${filename}...`);
    
    // Récupérer les données
    const data = await Model.find({}).lean();
    
    if (data.length === 0) {
      console.log(`   ⚠️  Aucune donnée trouvée pour ${filename}`);
      return;
    }
    
    // Créer le fichier CSV
    const filePath = path.join(EXPORT_DIR, filename);
    const writeStream = fs.createWriteStream(filePath);
    
    // Écrire l'en-tête
    writeStream.write(fields.join(',') + '\n');
    
    // Écrire les données
    let count = 0;
    for (const item of data) {
      // Créer un objet avec seulement les champs demandés
      const row = {};
      fields.forEach(field => {
        // Gérer les champs imbriqués (ex: address.city)
        if (field.includes('.')) {
          const parts = field.split('.');
          row[field] = parts.reduce((obj, key) => obj?.[key], item);
        } else {
          row[field] = item[field];
        }
      });
      
      writeStream.write(objectToCSVLine(row, fields) + '\n');
      count++;
    }
    
    writeStream.end();
    console.log(`   ✅ ${count} lignes exportées vers ${filename}`);
    
  } catch (error) {
    console.error(`   ❌ Erreur lors de l'export de ${filename}:`, error.message);
  }
}

// Fonction principale
async function exportAllData() {
  try {
    console.log('🚀 Démarrage de l\'export des données pour Power BI\n');
    console.log('📡 Connexion à MongoDB...');
    
    // Se connecter à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');
    
    // Créer le dossier d'export
    ensureExportDirExists();
    
    // Exporter chaque collection
    await exportToCSV(
      User,
      'users.csv',
      ['_id', 'username', 'email', 'createdAt', 'updatedAt']
    );
    
    await exportToCSV(
      Category,
      'categories.csv',
      ['_id', 'name', 'description', 'createdAt']
    );
    
    await exportToCSV(
      Product,
      'products.csv',
      ['_id', 'name', 'description', 'price', 'stock', 'category', 'imageUrl', 'createdAt', 'updatedAt']
    );
    
    await exportToCSV(
      Order,
      'orders.csv',
      ['_id', 'user', 'totalPrice', 'status', 'createdAt', 'updatedAt']
    );
    
    await exportToCSV(
      OrderItem,
      'order_items.csv',
      ['_id', 'order', 'product', 'quantity', 'price']
    );
    
    await exportToCSV(
      Review,
      'reviews.csv',
      ['_id', 'product', 'user', 'rating', 'comment', 'createdAt']
    );
    
    console.log('\n🎉 Export terminé avec succès !');
    console.log(`📂 Fichiers disponibles dans : ${EXPORT_DIR}\n`);
    console.log('📋 Prochaines étapes :');
    console.log('   1. Ouvrir Power BI Desktop');
    console.log('   2. Obtenir les données > Texte/CSV');
    console.log('   3. Importer chaque fichier CSV');
    console.log('   4. Créer les relations entre les tables');
    console.log('   5. Consulter le guide: GUIDE_POWER_BI.md\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error.message);
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.connection.close();
    console.log('👋 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Lancer l'export
exportAllData();
