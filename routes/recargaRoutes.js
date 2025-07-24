const express = require('express');
const router = express.Router();
const controller = require('../controllers/recargaController');

router.get('/carregar-km-inicial/:veiculo_id', controller.carregarKmInicial);
router.post('/iniciar', controller.iniciarRecarga);
router.post('/finalizar', controller.finalizarRecarga);
router.get('/iniciadas/:operador_id', controller.recargasIniciadas);
router.get('/ultima/:veiculoId', controller.ultimaRecarga);

module.exports = router;
