const path = require('path')

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');

const express = require('express')
const app     = express()
const port    = process.env.PORT || 3000

const sassMiddleware = require('node-sass-middleware')

const firebase = require('firebase');
const fbApp = firebase.initializeApp({
  apiKey: "AIzaSyAsJz6-q8nXCpghsXNZIVfl_fNx8382Wbc",
  authDomain: "ihost-d0717.firebaseapp.com",
  databaseURL: "https://ihost-d0717.firebaseio.com",
  projectId: "ihost-d0717",
  storageBucket: "ihost-d0717.appspot.com",
  messagingSenderId: "360332128546",
  appId: "1:360332128546:web:711750238146cca3cef57b"
})

const usersCol = fbApp.firestore().collection("users")


app.use(sassMiddleware({
  src: path.join(__dirname, 'src', 'stylesheets')
 ,dest: path.join(__dirname, 'public', 'stylesheets')
 ,debug: true
 ,outputStyle: 'compressed'
 ,prefix: "/stylesheets"
 ,indentedSyntax: true
}))
app.set('view engine', 'pug')
app.use(express.static('public', { index: false }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

var users = []; //TODO: make this use firebase

const authenticated = (req, res, next) => {
  if(req.session.user){
    next();     //If session exists, proceed to page
  } else {
    res.redirect('/login')
 }
}

app.get('/', (req, res) => {
  // console.log(req.session.user)
  res.render('index', {
    title: 'Hey',
    time: new Date(Date.now()),
    user: req.session.user
  })
})

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    time: new Date(Date.now())
  });
})

app.post('/register', function(req, res){
  let name = req.body.id.trim()
  let pwd = req.body.password.trim()
  if(!name || !pwd){
    res.render('register', {
      title: 'Register',
      time: new Date(Date.now()),
      message: 'Invalid username/password'
    });
  } else {
    usersCol.where("name", "==", name).get().then((snap) => {
      if(snap.docs.length == 0) {
        usersCol.add({name: name, password: pwd, validated: false, points: 0, reputation: 0})
        req.session.user = name;
        res.redirect('/profile');
      } else {
        res.render('register', {
          title: 'Register',
          time: new Date(Date.now()),
          message: 'Username taken! Did you mean to <a href="/login">login</a>?'
        })
      }
    }).catch((e) => {console.error(e)})
    // let newUser = {id: name, password: pwd};
    // users.push(newUser);
    
  }
});

app.get('/login', function(req, res){
  if(req.body.user) res.redirect('/profile') // user already logged in
  res.render('login', {
    title: 'Login',
    time: new Date(Date.now())
  });
});

app.post('/login', function(req, res){
  console.log(req.body.id, req.body.password)
  // console.log(users);
  if(!req.body.id || !req.body.password){
    console.log('what da hell gimme something')
    res.render('login', {
      message: "Username and password are required.", 
      time: new Date(Date.now())
    });
  } else {
    // TODO: make password not plaintext like lel?
    usersCol.where("name", "==", req.body.id).where("password", "==", req.body.password).get().then((snap) => {
      if(snap.docs.length == 0) {
        res.render('login', {
          message: "Invalid username/password!",
          time: new Date(Date.now())
        });
        return;
      } else if(snap.docs.length > 1) {
        console.error("more than 1 user found with exact credentials????")
        res.render('login', {
          message: "Bro bro bro. Duplicate entry found. Please contact an administrator.", 
          time: new Date(Date.now())
        })
      }
      let user = snap.docs[0].data()
      console.log('user found', user)
      req.session.user = user;
      delete req.session.user.password
      res.redirect('/profile');
    }).catch((err) => {
      console.error(err)
    })
    // users.filter(function(user){
    //   if(user.id === req.body.id && user.password === req.body.password) {
    //     console.log('user found')
    //     req.session.user = user;
    //     res.redirect('/profile');
    //     found = true;
    //   }
    // });
  }
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("user logged out.")
  });
  res.redirect('/login');
});

app.get('/profile', authenticated, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    user: req.session.user,
    time: new Date(Date.now())
  })
})

app.listen(port, () => console.log(`App listening on port ${port}.`))