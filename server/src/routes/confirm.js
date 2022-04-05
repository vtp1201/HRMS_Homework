const express = require('express');
const passport = require('passport');

const router = express.Router();

const confirmController = require('../controller/confirmController');
const {checkAdmin} = require('../middleware/authMiddleware');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/:id', checkAdmin, confirmController.getAllConfirmByIdDoc); //ckeck
router.post('/', checkAdmin, confirmController.addRoleByIdDoc); // check
router.put('/', confirmController.updateStatusConfirm); //check

module.exports = router;
