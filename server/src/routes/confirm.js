const express = require('express');
const passport = require('passport');

const router = express.Router();

const confirmController = require('../controller/confirmController');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/:id', confirmController.getAllConfirmByIdDoc); //ckeck
router.post('/', confirmController.addRoleByIdDoc); // check
router.put('/', confirmController.updateStatusConfirm); //check

module.exports = router;
