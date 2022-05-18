/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[env];

const db = {};

const databases = Object.keys(config.databases);

for (let i = 0; i < databases.length; i += 1) {
  const database = databases[i];
  const dbPath = config.databases[database];
  dbPath.logging = false;

  if (dbPath.use_env_variable) {
    db[database] = new Sequelize(process.env[dbPath.use_env_variable], dbPath);
  } else {
    db[database] = new Sequelize(
      dbPath.database,
      dbPath.username,
      dbPath.password,
      dbPath,
    );
  }
}

for (let i = 0; i < databases.length; i += 1) {
  const database = databases[i];

  fs.readdirSync(`${__dirname}/${database}`)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      const model = require(path.join(`${__dirname}/${database}`, file))(
        db[database],
        Sequelize.DataTypes,
      );
      db[model.name] = model;
    });
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
