const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../model/User');

passport.use('local-login',
    new LocalStrategy(
        {
            usernameField : 'name',
            passwordField : 'password',
            passReqToCallback : true 
        },
        async (req, username, password, done) => {
            try {
                const user = await User.findOne({name : username});
                if (!user) return done(null, false);
                if (!user.validPassword(password))
                    return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
)