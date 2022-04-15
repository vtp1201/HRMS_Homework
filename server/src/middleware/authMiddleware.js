const User = require('../model/User');
const Confirm = require('../model/Confirm');
const Document = require('../')

module.exports = {
    async checkAdmin(req, res, next) {
        const user = await User.findOne({ _id : req.user._id});
        if(user.role == 9 ) {
            return next();
        } 
        res.status(403);
        return res.json({
            msg: "Just admin can't exec"
        })
    },
    checkLogged(req, res, next) {
        if (req.isAuthenticated()) {
            res.status(401)
            return res.json({
                msg: "You are already logged in!"
            });
        }
        next();
    },
    async checkActive(req, res, next){
        console.log(req.originalUrl);
        try {
            const user = await User.findOne({
                _id: req.user._id
            })
            if (user.role === 9) {
                return next();
            }
            const document = await Document.findOne({
                url: req.originalUrl.slice(1)
            }) 
            const confirm = await Confirm.findOne({
                userId : req.user._id,
                docId: document._id
            })
            if (confirm.active === true) 
                return next();
            res.status(401);
            return res.json({
                msg:"can't access this file",
            });
        } catch (error) {
            res.status(401);
            return res.json({
                msg:"can't access this file",
            });
        }
    }
}