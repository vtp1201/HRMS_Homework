const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

class AuthController{
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

        const jwtToken = jwt.sign(
            { id: req.user.id},
            process.env.JWT_SECRET || 'key'
        );
        res.status(200);
        return res.json({ msg: "Welcome!", token: jwtToken });
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
