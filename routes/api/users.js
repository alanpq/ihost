const express = require('express')
const firebase = require('firebase')

const authenticated = require('./../middleware/authenticated')

/**
 * @typedef {import('../../server').Collections} Collections
 */

/**
 * @param {Collections} dbCollections
 */

module.exports = (dbCollections) => {
  const router = express.Router()
  router.get('/', (req, res) => {
    dbCollections.users.get().then((snap) => {
      res.status(200).json({
        code: 200,
        users: snap.docs.map(doc => {
          return doc.data()
        })
      })
    }).catch((e) => {
      console.error(e)
    })
  })

  router.get('/:username', (req, res) => {
    dbCollections.users.where("name", "==", req.params.username).get().then((snap) => {
      switch (snap.docs.length) {
        case 0:
          res.status(404).json({
            code: 404,
            message: 'user not found'
          })
          break;
        case 1:
          res.status(200).json({
            code: 200,
            message: 'user found',
            user: snap.docs[0].data()
          })
          break;
        default:
          res.status(500).json({
            code: 500,
            message: 'server error finding user'
          })
          console.error(`Duplicate username found!`)
          snap.docs.forEach((doc) => {
            console.error("- ", JSON.stringify(doc.data()))
          })
          break;
      }
    }).catch(() => {
      res.status(500).json({
        code: 500,
        message: 'server error finding user'
      })
    })
  })

  router.post('/:username/delete', authenticated, (req, res) => {
    if(req.params.username != req.session.user.name) {
      return res.status(401).json({
        code: 401,
        message: 'Invalid credentials.'
      })
    }
    console.log(req.body)
    if(!req.body.sure)
      return res.status(403).json({
        code: 403,
        message: "You aren't ready."
      })
    dbCollections.users.where("name", "==", req.params.username).get().then((snap) => {
      switch (snap.docs.length) {
        case 0:
          res.status(404).json({
            code: 404,
            message: 'user not found'
          })
          break;
        case 1:
          snap.docs[0].ref.delete().then( () => {
            res.status(200).json({
              code: 200,
              message: 'user deleted'
            })
          }).catch( (e) => {
            console.error(e) // todo: show this to user
          })
          break;
        default:
          res.status(500).json({
            code: 500,
            message: 'server error finding userr'
          })
          console.error(`Duplicate username found!`)
          snap.docs.forEach((doc) => {
            console.error("- ", JSON.stringify(doc.data()))
          })
          break;
      }
    }).catch((e) => {
      console.error(e)
      res.status(500).json({
        code: 500,
        message: 'server error finding user'
      })
    })
  })
  return router
}