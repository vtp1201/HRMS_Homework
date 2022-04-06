const Confirm = require('../model/Confirm');
const User = require('../model/User');

class userController {
    // GET /user/info 
    async getInfoUser(req, res) {
        try {
            const user = await User.findOne({
                _id: req.user._id
            }, {
                password: false,
                socialId: false
            });
            res.status(200);
            return res.json(user);
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "Can't get user info"
            });
        }
    }
    // GET /user/all (Admin)
    async getAllUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await User.count({role: 0});
            const users = await User.find({}, {
                    name: true,
                    _id: true,
                    role: 0
                })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            res.status(200);
            return res.json({
                users: users,
                current: page,
                pages: Math.ceil(count / perPage),
            });
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                msg: "something went wrong, try again!"
            });
        }
    }
    // GET /user/
    async getUsersByIdDoc(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        const active = req.query.active || true
        try {
            const count = await Confirm.count({
                docId: req.params.id,
                active: active,
            });
            const users = await Confirm.find(
                {
                    docId: req.params.id,
                    active: active,
                    deleted: false,
                }, {
                    _id: false,
                    userId: true,
                    status: true,
                })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .populate('userId');
            if (users.length === 0) {
                res.status(400);
                return res.json({
                    msg: 'No user found',
                });
            }
            res.status(200);
            return res.json({
                users: users,
                current: page,
                pages: Math.ceil(count / perPage),
            });
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                msg: "something went wrong, try again!"
            });
        }
    }
}

module.exports = new userController();
