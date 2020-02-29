const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const register = async (name, password, dbCollections) => {
  if (!name || !password)
    return {
      code: 400,
      message: 'Invalid username/password'
    }
  

  var res = {code: 500,
    message: "Please contact an administrator. ERROR RR-01"
  }
  await dbCollections.users.where("name", "==", name).get().then(function(snap) {
    if (snap.docs.length == 0) {
      let usr = { name: name, validated: false, admin: false, points: 0, reputation: 0 }
      bcrypt.hash(password, saltRounds).then(function (hash) {
        console.log(hash)
        usr.password = hash
        console.log(usr)
        dbCollections.users.add(usr)
      }).catch((e) => {
        console.error(e)
        return res = {
          code: 500,
          message: 'Please contact an administrator. ERROR RR-02'
        }
      });

      return res = {
        code: 201,
        user: usr
      }
    } else {
      return res = {
        code: 400,
        message: 'Username taken!'
      }
    }
  }).catch((e) => {
    console.error(e)
    return res = {
      code: 500,
      message: 'Please contact an administrator. ERROR RR-03'
    }
  })
  return res
}

module.exports = (dbCollections) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.render('register', {
      title: 'Register',
      time: new Date(Date.now())
    })
  })

  router.post('/', function (req, res) {
    let name = req.body.id.trim().replace(/\W/g, '')
    let pwd = req.body.password

    register(name, pwd, dbCollections).then((regRes) => {
      if(regRes.user) req.session.user = regRes.user;
      if(req.body.ajax)
        return res.status(regRes.code).json(regRes)
      
      if(regRes.code == 201) {
        return res.redirect('/profile')
      }
      return res.render('register', {
        title: 'Register',
        time: new Date(Date.now()),
        message: regRes.message
      });
    }).catch((e) => {
      console.error(e) // TODO: display this error
    })

    
  });
  return router
}