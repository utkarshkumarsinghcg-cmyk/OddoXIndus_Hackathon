const express = require('express');
const router = express.Router();
const moveController = require('../controllers/moveController');

router.get('/', moveController.getAllMoves);
router.get('/product/:productId', moveController.getMovesByProduct);
router.get('/location/:locationId', moveController.getMovesByLocation);

module.exports = router;
