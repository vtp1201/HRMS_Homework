const User = require('../model/User');
const bcrypt = require('bcrypt');

class AuthController{
    // GET /newAdmin
    async newAdmin (req, res) {
        try {
            const pass = await bcrypt.hash('123456', 10);
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
    async genrateToken(req, res) {

    }
}

module.exports = new AuthController();
