const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const googleOAuth = require('../util/googleOAuth');

class AuthController{
    // POST /loginGoogle
    async loginGoogle(req, res, next) {
        try {
            const tokenId = req.body.tokenId;
            const profile = await googleOAuth.getProfileInfo(tokenId);
            console.log(profile);
            const user = await User.findOne({socialId: profile.sub});
            if(user) {
                req.user = user;
                console.log(req.user)
                return next();
            }
            const ggUser = new User({
                name: `${profile.given_name} ${profile.family_name}`,
                email: profile.email.toLowerCase(),
                image: profile.picture,
                socialId: profile.sub,
                role: 0,
            });
            
            const newUser = await ggUser.save();
            req.user = newUser;
            return next();
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "can't login"
            })
        }
    }
    // GET /newAdmin
    async newAdmin (req, res) {
        try {
            const pass = await bcrypt.hash('admin', 10);
            const admin = new User({
                name: 'admin',
                isAdmin: true,
                password: pass
            });
            const result = await admin.save();
            res.status(200);
            return res.json(result);
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "can't create admin"
            });
        }
    }
    // 
    async generateToken(req, res) {
        if(!req.user) return res.json({
            msg: 'cant login',
        })

        const jwtToken = jwt.sign({
             id: req.user.id
        },process.env.JWT_SECRET || 'key', { 
            expiresIn : '1d' 
        }
        );
        res.status(200);
        return res.json({ 
            msg: "Welcome!", 
            username: req.user.name,
            token: jwtToken,
        });
    }
    // auth/logout
    logOut (req, res) {
        try {
            req.logout();
            res.status(200);
            return res.json({
                msg: 'sucess',
            });
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                msg: 'failue!',
            });
        }
        
    }
}

module.exports = new AuthController();
