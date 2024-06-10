const express = require('express');
const routes = require('../controllers/quote');
const router = new express.Router;

router.get('/',routes.geth);

router.get('/search-author',routes.getath);

module.exports = router;

