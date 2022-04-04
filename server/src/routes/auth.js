const express = require('express');
const passport = require('passport');

const router = express.Router();

const successLoginUrl = "http://localhost:3000/login/success";
const errorLoginUrl = "http://localhost:3000/login/error";

router.get('/google', 
    passport.authenticate("google", { scope: ["profile", "email"]})
);

router.get('/google/callback',
    passport.authenticate("google", {
        failureMessage: "Cannot login to Google, please try again later!",
        failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl,
    }),
    (req, res) => {
        res.status(200);
        res.json(req.user);
    }
);

module.exports = router
