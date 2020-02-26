const express = require('express')
const app = express()
const port = 80

app.use('/public')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(port, () => console.log(`App listening on port ${port}.`))