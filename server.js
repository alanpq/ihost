const path = require('path')

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('express-session');

const express = require('express')
const app     = express()
const port    = process.env.PORT || 3000

const sassMiddleware = require('node-sass-middleware')


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
    var err = new Error("Not logged in!");
    console.log(req.session.user);
    next(err);  //Error, trying to access unauthorized page!
 }
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Hey',
    time: new Date(Date.now()),
    id: req.session.user ? req.session.user.id : undefined
  })
})

app.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign up',
    time: new Date(Date.now())
  });
})

app.post('/signup', function(req, res){
  if(!req.body.id || !req.body.password){
    res.status("400");
    res.send("Invalid details!");
  } else {
    users.filter(function(user){
    if(user.id === req.body.id){
      res.render('signup', {
        title: 'Sign up',
        time: new Date(Date.now()),
        message: 'User Already Exists! Login or choose another user id'
      });
    }
    });
    let newUser = {id: req.body.id, password: req.body.password};
    users.push(newUser);
    req.session.user = newUser;
    res.redirect('/profile');
  }
});

app.get('/login', function(req, res){
  res.render('login', {
    title: 'Login',
    time: new Date(Date.now())
  });
});

app.post('/login', function(req, res){
  console.log(users);
  if(!req.body.id || !req.body.password){
    console.log('what da hell gimme something')
    res.render('login', {
      message: "Please enter both id and password", 
      time: new Date(Date.now())
    });
  } else {
    let found = false;
    users.filter(function(user){
      if(user.id === req.body.id && user.password === req.body.password) {
        console.log('user found')
        req.session.user = user;
        res.redirect('/profile');
        found = true;
      }
    });
    if(found) return;
    res.render('login', {
      message: "Invalid credentials!",
      time: new Date(Date.now())
    });
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
    id: req.session.user.id,
    time: new Date(Date.now())
  })
})

app.listen(port, () => console.log(`App listening on port ${port}.`))