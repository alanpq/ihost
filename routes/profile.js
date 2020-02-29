const express = require('express');
const router = express.Router();
const authenticated = require('./middleware/authenticated')

router.get('/', authenticated, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    user: req.session.user,
    time: new Date(Date.now())
  })
})

//export this router to use in our index.js
module.exports = router;