const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');

router.get('/all', userController.getAllUser);
router.get('/sync/:id', userController.getUsersSyncByIdDoc);
router.get('/notsync/:id', userController.getUsersNotSyncByIdDoc);

module.exports = router;
