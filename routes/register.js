const express = require('express')
module.exports = (dbCollections) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.render('register', {
      title: 'Register',
      time: new Date(Date.now())
    })
  })

  router.post('/', function (req, res) {
    let name = req.body.id.trim()
    let pwd = req.body.password.trim()
    if (!name || !pwd) {
      res.render('register', {
        title: 'Register',
        time: new Date(Date.now()),
        message: 'Invalid username/password'
      });
    } else {
      dbCollections.users.where("name", "==", name).get().then((snap) => {
        if (snap.docs.length == 0) {
          dbCollections.users.add({ name: name, password: pwd, validated: false, admin: false, points: 0, reputation: 0 })
          req.session.user = name;
          res.redirect('/profile');
        } else {
          res.render('register', {
            title: 'Register',
            time: new Date(Date.now()),
            message: 'Username taken! Did you mean to <a href="/login">login</a>?'
          })
        }
      }).catch((e) => { console.error(e) })
      // let newUser = {id: name, password: pwd};
      // users.push(newUser);
    }
  });
  return router
}