const express = require('express');

const authRoute = require('./auth');
const documentRoute = require('./document');
const userRoute = require('./user');
const confirmRoute = require('./confirm');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/document', documentRoute);
router.use('/user', userRoute);
router.use('/confirm', confirmRoute);

module.exports = router