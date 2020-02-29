const express = require('express');
const router = express.Router();

router.get('/', require('./admin/dashboard.js'))

module.exports = router;