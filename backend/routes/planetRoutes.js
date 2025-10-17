
const express = require('express');
const router = express.Router();
const planetController = require('../controllers/planetController');

router.get('/', planetController.getAllPlanets);
router.get('/:id', planetController.getPlanetById);
router.post('/', planetController.createPlanet);
router.put('/:id', planetController.updatePlanet);
router.delete('/:id', planetController.deletePlanet);

module.exports = router;
