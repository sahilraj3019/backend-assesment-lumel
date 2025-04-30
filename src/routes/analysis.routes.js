const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

router.get('/revenue', analysisController.getTotalRevenue);

module.exports = router;
