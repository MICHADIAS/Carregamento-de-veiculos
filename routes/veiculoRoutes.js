const express = require('express');
const router = express.Router();
const controller = require('../controllers/veiculoController');

router.get('/', controller.listarVeiculos);

module.exports = router;
