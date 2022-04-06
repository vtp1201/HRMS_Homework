const User = require('../model/User');

module.exports = {
    async checkAdmin(req, res, next) {
        const user = await User.findOne({ _id : req.user._id});
        if(user.role == 9 ) {
            return next();
        } 
        res.status(401);
        return res.json({
            msg: "Just admin can't exec"
        })
    }
}