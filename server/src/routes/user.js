const express = require('express');
const passport = require("passport");

const router = express.Router();

const userController = require('../controller/userController');
const {checkAdmin} = require('../middleware/authMiddleware');

router.all('*', passport.authenticate("jwt", { session: false }), checkAdmin);
router.get('/all', userController.getAllUser); //check
router.get('/sync/:id', userController.getUsersByIdDoc); // check

module.exports = router;
