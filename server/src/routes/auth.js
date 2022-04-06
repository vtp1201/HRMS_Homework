const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controller/authController');

const { checkLogged } = require('../middleware/authMiddleware');

// router.get('/newAdmin', authController.newAdmin);

router.post('/admin', checkLogged,
    passport.authenticate("local-login", {})
    , authController.generateToken
);

router.post('/loginGoogle', checkLogged,
    authController.loginGoogle,
    authController.generateToken
)

router.get('/logout'
    , passport.authenticate("jwt", { session: false })
    , authController.logOut
);

module.exports = router
