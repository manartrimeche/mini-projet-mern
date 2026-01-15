/**
 * Script de génération de données pour MongoDB
 * Ajoute des données réalistes pour tous les modèles
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Profile = require('./models/Profile');
const Review = require('./models/Review');
const Task = require('./models/Task');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosmetics_db')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur de connexion:', err));

// Données de seed
const categoriesData = [
    { name: 'Soins du visage', description: 'Crèmes, sérums et masques pour le visage' },
    { name: 'Maquillage', description: 'Produits de maquillage pour tous les styles' },
    { name: 'Parfums', description: 'Fragrances pour hommes et femmes' },
    { name: 'Soins du corps', description: 'Lotions, gels douche et soins corporels' },
    { name: 'Soins des cheveux', description: 'Shampoings, après-shampoings et masques capillaires' },
    { name: 'Soins des ongles', description: 'Vernis et soins pour les ongles' }
];

const productsData = [
    { name: 'Sérum Vitamine C', description: 'Sérum éclaircissant à la vitamine C pure', price: 45.99, stock: 50, brand: 'GlowLab', rating: 4.5 },
    { name: 'Crème Hydratante Bio', description: 'Crème hydratante certifiée bio', price: 32.50, stock: 75, brand: 'NatureSkin', rating: 4.8 },
    { name: 'Mascara Volume XXL', description: 'Mascara effet volume intense', price: 18.90, stock: 100, brand: 'BeautyPro', rating: 4.2 },
    { name: 'Rouge à Lèvres Mat', description: 'Rouge à lèvres longue tenue effet mat', price: 22.00, stock: 80, brand: 'ColorMe', rating: 4.6 },
    { name: 'Parfum Floral Élégance', description: 'Eau de parfum aux notes florales', price: 89.99, stock: 30, brand: 'Essence', rating: 4.9 },
    { name: 'Gel Douche Relaxant', description: 'Gel douche à la lavande', price: 12.50, stock: 120, brand: 'PureSpa', rating: 4.3 },
    { name: 'Shampooing Réparateur', description: 'Shampooing pour cheveux abîmés', price: 15.90, stock: 90, brand: 'HairCare', rating: 4.4 },
    { name: 'Masque Capillaire Intense', description: 'Masque nourrissant profond', price: 28.00, stock: 60, brand: 'HairCare', rating: 4.7 },
    { name: 'Vernis à Ongles Rose', description: 'Vernis longue tenue rose poudré', price: 9.99, stock: 150, brand: 'NailArt', rating: 4.1 },
    { name: 'Fond de Teint Fluide', description: 'Fond de teint couvrance moyenne', price: 35.00, stock: 70, brand: 'BeautyPro', rating: 4.5 },
    { name: 'Palette Ombres à Paupières', description: '12 teintes pour tous les looks', price: 42.00, stock: 55, brand: 'ColorMe', rating: 4.8 },
    { name: 'Crème Anti-Âge Premium', description: 'Crème anti-rides haute performance', price: 78.50, stock: 40, brand: 'GlowLab', rating: 4.9 },
    { name: 'Lotion Corps Hydratante', description: 'Lotion hydratation 24h', price: 19.90, stock: 85, brand: 'PureSpa', rating: 4.4 },
    { name: 'Eau Micellaire Douce', description: 'Démaquillant tout-en-un', price: 14.50, stock: 110, brand: 'NatureSkin', rating: 4.6 },
    { name: 'Baume à Lèvres Réparateur', description: 'Baume nourrissant pour lèvres sèches', price: 7.99, stock: 200, brand: 'NatureSkin', rating: 4.3 }
];

const usersData = [
    { username: 'alice_martin', email: 'alice.martin@email.com', password: 'password123', phone: '0612345678', address: '12 Rue de Paris, Tunis' },
    { username: 'bob_dupont', email: 'bob.dupont@email.com', password: 'password123', phone: '0623456789', address: '45 Avenue Habib Bourguiba, Sfax' },
    { username: 'claire_bernard', email: 'claire.bernard@email.com', password: 'password123', phone: '0634567890', address: '78 Rue de la Liberté, Sousse' },
    { username: 'david_rousseau', email: 'david.rousseau@email.com', password: 'password123', phone: '0645678901', address: '23 Boulevard Mohamed V, Bizerte' },
    { username: 'emma_petit', email: 'emma.petit@email.com', password: 'password123', phone: '0656789012', address: '56 Rue de Carthage, Tunis' },
    { username: 'felix_moreau', email: 'felix.moreau@email.com', password: 'password123', phone: '0667890123', address: '89 Avenue de France, Monastir' },
    { username: 'gabrielle_simon', email: 'gabrielle.simon@email.com', password: 'password123', phone: '0678901234', address: '34 Rue Ibn Khaldoun, Tunis' },
    { username: 'hugo_laurent', email: 'hugo.laurent@email.com', password: 'password123', phone: '0689012345', address: '67 Avenue Farhat Hached, Nabeul' }
];

async function seedDatabase() {
    try {
        console.log('Nettoyage de la base de données...');

        // Supprimer les index problématiques
        try {
            await User.collection.dropIndex('profile_1');
            console.log('✅ Index profile_1 supprimé');
        } catch (err) {
            // L'index n'existe peut-être pas, on continue
        }

        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        await Profile.deleteMany({});
        await Order.deleteMany({});
        await OrderItem.deleteMany({});
        await Review.deleteMany({});
        await Task.deleteMany({});

        // 1. Créer les catégories
        console.log('📁 Création des catégories...');
        const categories = await Category.insertMany(categoriesData);
        console.log(`✅ ${categories.length} catégories créées`);

        // 2. Créer les produits avec catégories
        console.log('🛍️  Création des produits...');
        const productsWithCategories = productsData.map((product, index) => ({
            ...product,
            categories: [categories[index % categories.length]._id]
        }));
        const products = await Product.insertMany(productsWithCategories);
        console.log(`✅ ${products.length} produits créés`);

        // 3. Créer les utilisateurs
        console.log('👥 Création des utilisateurs...');
        const users = [];
        for (const userData of usersData) {
            const user = new User(userData);
            await user.save(); // Le middleware hashera le mot de passe
            users.push(user);
        }
        console.log(`✅ ${users.length} utilisateurs créés`);

        // 4. Créer les profils
        console.log('📝 Création des profils...');
        const profiles = [];
        for (let i = 0; i < users.length; i++) {
            const profile = await Profile.create({
                user: users[i]._id,
                firstName: users[i].username.split('_')[0],
                lastName: users[i].username.split('_')[1],
                dateOfBirth: new Date(1990 + i, i % 12, (i * 3) % 28 + 1),
                gender: i % 2 === 0 ? 'female' : 'male',
                loyaltyPoints: Math.floor(Math.random() * 500),
                preferences: {
                    skinType: ['normal', 'dry', 'oily', 'combination'][i % 4],
                    concerns: ['hydration', 'anti-aging', 'acne'][i % 3],
                    favoriteCategories: [categories[i % categories.length]._id]
                }
            });
            profiles.push(profile);

            // Lier le profil à l'utilisateur
            users[i].profile = profile._id;
            await users[i].save();
        }
        console.log(`✅ ${profiles.length} profils créés`);

        // 5. Créer des avis
        console.log('⭐ Création des avis...');
        const reviews = [];
        const reviewComments = [
            'Excellent produit, je recommande !',
            'Très satisfait de mon achat',
            'Bon rapport qualité-prix',
            'Produit conforme à mes attentes',
            'Je rachèterai certainement',
            'Efficace et agréable à utiliser',
            'Un peu cher mais de qualité',
            'Résultats visibles rapidement'
        ];

        for (let i = 0; i < 20; i++) {
            const review = await Review.create({
                user: users[i % users.length]._id,
                product: products[i % products.length]._id,
                rating: 3 + Math.floor(Math.random() * 3), // 3-5 étoiles
                comment: reviewComments[i % reviewComments.length]
            });
            reviews.push(review);

            // Ajouter l'avis au produit
            products[i % products.length].reviews.push(review._id);
            await products[i % products.length].save();
        }
        console.log(`✅ ${reviews.length} avis créés`);

        // 6. Créer des commandes avec items
        console.log('📦 Création des commandes...');
        const orders = [];
        const orderItems = [];

        for (let i = 0; i < 15; i++) {
            const user = users[i % users.length];
            const numItems = 1 + Math.floor(Math.random() * 4); // 1-4 items par commande
            let totalPrice = 0;

            // Créer d'abord la commande (sans items)
            const order = await Order.create({
                user: user._id,
                items: [], // Sera rempli après
                totalPrice: 0, // Sera mis à jour après
                status: ['pending', 'processing', 'shipped', 'delivered'][i % 4],
                shippingAddress: user.address,
                paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][i % 3],
                isPaid: i % 3 !== 0,
                createdAt: new Date(2024, (i % 12), (i * 2) % 28 + 1)
            });

            // Créer les items de commande avec la référence à la commande
            const items = [];
            for (let j = 0; j < numItems; j++) {
                const product = products[(i + j) % products.length];
                const quantity = 1 + Math.floor(Math.random() * 3); // 1-3 quantité
                const price = product.price;

                const orderItem = await OrderItem.create({
                    order: order._id,
                    product: product._id,
                    quantity: quantity,
                    price: price
                });

                orderItems.push(orderItem);
                items.push(orderItem._id);
                totalPrice += price * quantity;
            }

            // Mettre à jour la commande avec les items et le prix total
            order.items = items;
            order.totalPrice = totalPrice;
            await order.save();

            orders.push(order);

            // Ajouter la commande à l'utilisateur
            user.orders.push(order._id);
            await user.save();
        }
        console.log(`✅ ${orders.length} commandes créées avec ${orderItems.length} items`);

        // 7. Créer des tâches
        console.log('✅ Création des tâches...');
        const tasksData = [
            { title: 'Routine matinale', description: 'Appliquez votre routine de soins du matin', points: 50, category: 'skincare', type: 'daily' },
            { title: 'Premier achat', description: 'Effectuez votre première commande', points: 100, category: 'shopping', type: 'onboarding' },
            { title: 'Laisser un avis', description: 'Donnez votre avis sur un produit', points: 30, category: 'review', type: 'weekly' },
            { title: 'Partager sur les réseaux', description: 'Partagez vos produits préférés', points: 20, category: 'social', type: 'challenge' },
            { title: 'Soin capillaire', description: 'Faites un masque pour vos cheveux', points: 40, category: 'haircare', type: 'weekly' }
        ];

        const tasks = [];
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < tasksData.length; j++) {
                const isCompleted = Math.random() > 0.5;
                const task = await Task.create({
                    user: users[i]._id,
                    title: tasksData[j].title,
                    description: tasksData[j].description,
                    category: tasksData[j].category,
                    type: tasksData[j].type,
                    rewards: {
                        points: tasksData[j].points,
                        discountPoints: Math.floor(tasksData[j].points / 10)
                    },
                    status: isCompleted ? 'completed' : 'pending',
                    completedAt: isCompleted ? new Date() : null
                });
                tasks.push(task);
            }
        }
        console.log(`✅ ${tasks.length} tâches créées`);

        console.log('\n🎉 Génération de données terminée avec succès !');
        console.log(`\n📊 Résumé:`);
        console.log(`   - ${categories.length} catégories`);
        console.log(`   - ${products.length} produits`);
        console.log(`   - ${users.length} utilisateurs`);
        console.log(`   - ${profiles.length} profils`);
        console.log(`   - ${reviews.length} avis`);
        console.log(`   - ${orders.length} commandes`);
        console.log(`   - ${orderItems.length} items de commande`);
        console.log(`   - ${tasks.length} tâches`);

    } catch (error) {
        console.error('❌ Erreur lors de la génération des données:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Déconnexion de MongoDB');
    }
}

// Exécuter le script
seedDatabase();
