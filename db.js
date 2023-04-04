// Charger les variables d'environnement
require('dotenv').config();

const Sequelize = require('sequelize')

// Initialiser Sequelize avec les informations de connexion
const sequelize = new Sequelize(
    'appforum',
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
});

// Vérifier la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données :', err);
    });

module.exports = sequelize