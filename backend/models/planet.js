const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Planet = sequelize.define('Planet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  diameter: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  orbitalPeriod: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

module.exports = Planet;
