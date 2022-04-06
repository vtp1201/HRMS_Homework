const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../../model/User');

const GOOGLE_CALLBACK_URL = "http://localhost:5000/api/v1/auth/google/callback";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            //console.log(profile)
            try {
                const user = await User.findOne({socialId: profile.id})
                if (!user) {
                    const ggUser = new User({
                        name: profile.displayName,
                        email: (profile.emails[0].value || '').toLowerCase(),
                        image: profile.photos[0].value,
                        socialId: profile.id,
                        isAdmin: false,
                    });
                    ggUser.save((err) => {
                        if (err) return done(err);
                        return done(null, ggUser);
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);
passport.serializeUser((user, cb) => {
    //console.log("Serializing user:", user);
    cb(null, user.id);
});
  
passport.deserializeUser(async (id, cb) => {
    const user = await User.findOne({ _id: id }).catch((err) => {
        //console.log("Error deserializing", err);
        cb(err, null);
    });
  
    //console.log("DeSerialized user", user);
  
    if (user) cb(null, user);
});