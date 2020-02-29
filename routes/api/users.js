const express = require('express')
const firebase = require('firebase')

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
        statusCode: 200,
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
            statusCode: 404,
            message: 'user not found'
          })
          break;
        case 1:
          res.status(200).json({
            status: 200,
            message: 'user found',
            user: snap.docs[0].data()
          })
          break;
        default:
          res.status(500).json({
            statusCode: 500,
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
        statusCode: 500,
        message: 'server error finding user'
      })
    })
  })
  return router
}