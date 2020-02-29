const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard',
    user: req.session.user,
    time: new Date(Date.now())
  })
})

module.exports = router;