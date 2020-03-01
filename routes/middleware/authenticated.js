module.exports = (req, res, next) => {
  if(req.session.user) next()
  else if(req.body.trad || (req.method == "GET" && !req.body.ajax)) res.redirect('/login')
  else res.status(401).json({code: 401, message: 'not logged in'})
}
