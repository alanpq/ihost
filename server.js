const path = require('path')

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

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

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', time: new Date(Date.now()) })
})

app.listen(port, () => console.log(`App listening on port ${port}.`))