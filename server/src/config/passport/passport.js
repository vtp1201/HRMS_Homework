const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../model/User');

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'key',
        },
        async function (jwtPayload, done) {
            try {
                const user = await User.findById(jwtPayload.id);
                if(user) return done(null, user);
                return done(null, false);
            } catch (err) {
                return done(err);
            }
        }
    )
)

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