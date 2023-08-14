const express = require('express');
const router = express.Router();
const createGameController = require('../controllers/createGame'); // Adjust the path if needed

router.post('/', createGameController.createGame);

module.exports = router;

