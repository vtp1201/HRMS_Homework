const express = require('express');
const passport = require('passport');

const router = express.Router();

const authController = require('../controller/authController');

const successLoginUrl = "http://localhost:3000/login/success";
const errorLoginUrl = "http://localhost:3000/login/error";

// router.get('/newAdmin', authController.newAdmin);

router.post('/admin',
    passport.authenticate("local-login", {})
    , authController.generateToken
);

router.get('/google', 
    passport.authenticate("google", { scope: ["profile", "email"]})
);

router.get('/google/callback',
    passport.authenticate("google", {
        failureMessage: "Cannot login to Google, please try again later!",
        /* failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl, */
    })
    , authController.generateToken
);

router.get('/logout', authController.logOut);

module.exports = router
