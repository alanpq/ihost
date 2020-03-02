require('dotenv').config();

const path = require('path')

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');

const express = require('express')
const app     = express()
const port    = process.env.PORT || 3000

const sassMiddleware = require('node-sass-middleware')
const postcssMiddleware = require('postcss-middleware');

const cors = require('cors');
const jwt = require('jsonwebtoken');

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


/**
 * Database Collections definition
 * @typedef {Object} Collections
 * @property {firebase.firestore.CollectionReference<firebase.firestore.DocumentData>} users
 */
const dbCollections = {
  users: fbApp.firestore().collection("users")
}

app.use(sassMiddleware({
  src: path.join(__dirname, 'src', 'stylesheets')
 ,dest: path.join(__dirname, 'public', 'stylesheets')
 ,debug: true
 ,outputStyle: 'compressed'
 ,prefix: "/stylesheets"
 ,indentedSyntax: true
}))

app.use('/stylesheets', postcssMiddleware({
  plugins: [
    require('autoprefixer')
  ]
}));
app.set('view engine', 'pug')
app.use(express.static('public', { index: false }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "Your secret key",
  saveUninitialized: false,
  unset: 'destroy',
  resave: false,
  cookie: {
    secure: false,
    sameSite: 'strict'
  }
})); //TODO: change session store from MemoryStore for prod

//TODO: make route titles defined only once
//TODO: add message localisation support
app.use(require('./routes')(dbCollections))

app.listen(port, () => console.log(`App listening on port ${port}.`))