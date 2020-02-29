const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // console.log(req.session.user)
  res.render('index', {
    title: 'Hey',
    time: new Date(Date.now()),
    user: req.session.user
  })
})

//export this router to use in our index.js
module.exports = router;