const express = require('express')
const authenticated = require('./routes/middleware/authenticated')
const admin = require('./routes/middleware/admin')

module.exports = (usersCol) => {
  const router = express.Router();
  router.use('/'        , require('./routes/index'))
  router.use('/login'   , require('./routes/login')(usersCol))
  router.use('/logout'  , require('./routes/logout'))
  router.use('/register', require('./routes/register')(usersCol))
  //logged in
  router.use('/profile' , authenticated, require('./routes/profile'))
  // admin
  router.use('/admin'   , authenticated, admin, require('./routes/admin'))

  return router
};