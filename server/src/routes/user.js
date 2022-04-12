const express = require('express');
const passport = require("passport");

const router = express.Router();

const userController = require('../controller/userController');
const {checkAdmin} = require('../middleware/authMiddleware');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/info', userController.getInfoUser);
router.get('/all', checkAdmin, userController.getAllUser); //check
router.get('/:id', checkAdmin, userController.getUsersByIdDoc); // check

module.exports = router;
