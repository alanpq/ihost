const express = require('express');
const firebase = require('firebase');

/**
 * @typedef {import('../../server').Collections} Collections
 */

/**
 * @param {Collections} dbCollections
 */

module.exports = (dbCollections) => {
    const router = express.Router();
    router.get('/', (req, res) => {res.send('api')})
    router.use('/users', require('./api/users')(dbCollections))
    return router
}