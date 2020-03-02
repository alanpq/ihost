const util = require('util');

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (name, password, dbCollections, makeToken=true) => { //TODO: fix this god awful promise async/await structure
  let res = {}
  await dbCollections.users
        .where("name", "==", name)
        .get()
        .then(async (snap) => {
    if (snap.docs.length == 0) {
      return res = {
        code: 403,
        message: "Invalid username/password"
      }
    } else if (snap.docs.length > 1) {
      console.error("more than 1 user found with exact username????")
      return res = {
        code: 500,
        message: "Please contact an administrator. ERROR RL-01"
      }
    }
    const usr = snap.docs[0].data()
    const match = await bcrypt.compare(password, usr.password)
    if(!match) return res = {
      code: 403,
      message: "Invalid username/password"
    }
    // hide sensitive info
    delete usr.password
    return usr

    
  }).then(async (usr) => {
    if(usr.code) return usr; // usr isn't actually a user, it's a response code (aka something went wrong - pass it straight through)
    if(!makeToken) return res = {
      code: 200,
      user: usr
    }
    const now       = Math.floor(Date.now() / 1000)
        , iat       = (now-10)
        , expiresIn = 3600
        , expr      = (now + expiresIn)
        , notBefore = iat
        , jwtID     = Math.random().toString(36).substring(7)

    const payload = {
      iat: iat,
      jwtid: jwtID,
      audience: 'TEST',
      data: usr
    }
    await util.promisify(jwt.sign)(payload, "supersuperdupersecret:)", //TODO: link secret to env
    { algorithm: 'HS256', expiresIn : expiresIn}).then((token) => {
      if(token != false) {
        res = {
          code: 200,
          token: token,
          user: usr,
          expires: expr
        }
      } else {
        console.error("Failed to create login JWT.")
        res = {
          code: 500,
          message: "Failed to create token. ERROR RL-03"
        }
      }
    });
  }).catch((err) => {
    console.error(err)
    res = {
      code: 500,
      message: "Please contact an administrator. ERROR RL-04"
    }
    return
  })
  return res
}

module.exports = (dbCollections) => {
  const router = express.Router()

  router.get('/', function (req, res) {
    if (req.body.user) res.redirect('/profile') // user already logged in
    res.render('login', {
      title: 'Login',
      time: new Date(Date.now())
    })
  })

  router.post('/', function (req, res) {
    console.log(req.body.id, req.body.password)
    const id  = (req.body.id || "").trim().replace(/\W/g, '')
    const pwd = req.body.password
    login(id, pwd, dbCollections, req.body.rememberme || false).then( (loginRes) => {
      req.session.user = loginRes.user
      req.session.token = loginRes.token
    
      if(!req.body.trad) // TODO: think about this trad stuff
        return res.status(loginRes.code).json(loginRes)
      else {
        if(loginRes.user)
          return res.redirect('/profile')
        return res.render('login', {
          title: "Login",
          message: loginRes.message,
          time: new Date(Date.now())
        })
      }
    }).catch(err => {
      console.error(err)
    })
  })
  return router
}