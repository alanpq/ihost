const express = require('express')
const bcrypt = require('bcrypt')

const login = async (name, password, dbCollections) => {
  // TODO: make password not plaintext like lel?
  let res = {}
  await dbCollections.users.where("name", "==", name).get().then(async (snap) => {
    if (snap.docs.length == 0) {
      res = {
        code: 403,
        message: "Invalid username/password!"
      }
      return
    } else if (snap.docs.length > 1) {
      console.error("more than 1 user found with exact credentials????")
      res = {
        code: 500,
        message: "Please contact an administrator. ERROR RL-01"
      }
      return
    }
    let usr = snap.docs[0].data()
    const match = await bcrypt.compare(password, usr.password)
    if(!match) return res = {
      code: 403,
      message: "Invalid username/password"
    }
    // hide sensitive info
    delete usr.password
    res = {
      code: 200,
      user: usr
    }
    return
  }).catch((err) => {
    console.error(err)
    res = {
      code: 500,
      message: "Please contact an administrator. ERROR RL-02"
    }
    return
  })
  return res
}

module.exports = (dbCollections) => {
  const router = express.Router();

  router.get('/', function (req, res) {
    if (req.body.user) res.redirect('/profile') // user already logged in
    res.render('login', {
      title: 'Login',
      time: new Date(Date.now())
    });
  });

  router.post('/', function (req, res) {
    console.log(req.body.id, req.body.password)
    login(req.body.id.trim().replace(/\W/g, ''), req.body.password, dbCollections).then( (loginRes) => {
      if(loginRes.user)
        req.session.user = loginRes.user
    
      if(req.body.ajax) {
        return res.status(loginRes.code).json(loginRes)
      } else {
        if(loginRes.user)
          return res.redirect('/profile')
        return res.render('login', {
          title: "Login",
          message: loginRes.message,
          time: new Date(Date.now())
        })
      }
    })
  });
  return router
}