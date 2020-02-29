const express = require('express');

const login = async (name, password, dbCollections) => {
  // TODO: make password not plaintext like lel?
  let res = {}
  await dbCollections.users.where("name", "==", name).where("password", "==", password).get().then((snap) => {
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
        message: "Please contact an administrator."
      }
      return
    }
    let usr = snap.docs[0].data()
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
      message: "Please contact an administrator."
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
    login(req.body.id, req.body.password, dbCollections).then( (loginRes) => {
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
    

    // console.log(users);
    // if (!req.body.id || !req.body.password) {
    //   console.log('what da hell gimme something')
    //   res.render('login', {
    //     message: "Username and password are required.",
    //     time: new Date(Date.now())
    //   });
    // } else {
    //   // TODO: make password not plaintext like lel?
    //   dbCollections.users.where("name", "==", req.body.id).where("password", "==", req.body.password).get().then((snap) => {
    //     if (snap.docs.length == 0) {
    //       res.render('login', {
    //         message: "Invalid username/password!",
    //         time: new Date(Date.now())
    //       });
    //       return;
    //     } else if (snap.docs.length > 1) {
    //       console.error("more than 1 user found with exact credentials????")
    //       res.render('login', {
    //         message: "Bro bro bro. Duplicate entry found. Please contact an administrator.",
    //         time: new Date(Date.now())
    //       })
    //     }
    //     let user = snap.docs[0].data()
    //     console.log('user found', user)
    //     req.session.user = user;
    //     delete req.session.user.password
    //     res.redirect('/profile');
    //   }).catch((err) => {
    //     console.error(err)
    //   })
      // users.filter(function(user){
      //   if(user.id === req.body.id && user.password === req.body.password) {
      //     console.log('user found')
      //     req.session.user = user;
      //     res.redirect('/profile');
      //     found = true;
      //   }
      // });
  });
  return router
}