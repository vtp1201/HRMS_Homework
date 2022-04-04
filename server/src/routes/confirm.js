const express = require('express');

const router = express.Router();

const confirmController = require('../controller/confirmController');

router.get('/:id', confirmController.getAllConfirmByIdDoc); //ckeck
router.post('/', confirmController.addRoleByIdDoc); // check
router.put('/', confirmController.updateStatusConfirm); //check

module.exports = router;
