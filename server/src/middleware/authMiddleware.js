const Role = require('../model/Role');

module.exports = {
    async checkAdmin(req, res, next) {
        const role = await Role.findOne({ _id : req.user.role})
        if(role && role.name == 'admin') {
            return next();
        } 
        res.status(401);
        return res.json({
            msg: "Just admin can't exec"
        })
    }
}