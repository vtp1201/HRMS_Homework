const express = require('express');
const passport = require("passport");

const router = express.Router();

const userController = require('../controller/userController');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/all', userController.getAllUser); //check
router.get('/sync/:id', userController.getUsersSyncByIdDoc); // check
router.get('/notsync/:id', userController.getUsersNotSyncByIdDoc);

module.exports = router;
