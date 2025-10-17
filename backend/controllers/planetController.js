const Planet = require('../models/planet');

exports.getAllPlanets = async (req, res) => {
  const planets = await Planet.findAll();
  res.json(planets);
};

exports.getPlanetById = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (planet) {
    res.json(planet);
  } else {
    res.status(404).json({ message: 'Planet not found' });
  }
};

exports.createPlanet = async (req, res) => {
  const { name, description, diameter, orbitalPeriod } = req.body;
  const newPlanet = await Planet.create({ name, description, diameter, orbitalPeriod });
  res.status(201).json(newPlanet);
};

exports.updatePlanet = async (req, res) => {
  const { name, description, diameter, orbitalPeriod } = req.body;
  const planet = await Planet.findByPk(req.params.id);
  if (planet) {
    planet.name = name;
    planet.description = description;
    planet.diameter = diameter;
    planet.orbitalPeriod = orbitalPeriod;
    await planet.save();
    res.json(planet);
  } else {
    res.status(404).json({ message: 'Planet not found' });
  }
};

exports.deletePlanet = async (req, res) => {
  const planet = await Planet.findByPk(req.params.id);
  if (planet) {
    await planet.destroy();
    res.json({ message: 'Planet deleted' });
  } else {
    res.status(404).json({ message: 'Planet not found' });
  }
};
