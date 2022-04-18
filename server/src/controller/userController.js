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
        try {
            const perPage = parseInt(req.query.perPage) || 10;
            const page = parseInt(req.query.page) || 1;
            let active = false;
            if(req.query.active) {
                if (req.query.active == 'all') {
                    active = [true, false];
                }
                else {
                    active = JSON.parse(req.query.active)
                }
            }

            const [count, confirms] = await Promise.all([
                Confirm.count({
                    docId: req.params.id,
                    active: active,
                }),
                Confirm.find(
                    {
                        docId: req.params.id,
                        active: {$in : active},
                    }, {
                        _id: false,
                        userId: true,
                        status: true,
                        active: true,
                    })
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .populate('userId')
            ])
            if (confirms.length === 0) {
                res.status(200);
                return res.json({
                    users: []
                });
            }
            const users = []; 
            confirms.forEach(user => {
                users.push({
                    userId: user.userId._id,
                    name: user.userId.name,
                    image: user.userId.image,
                    updateAt: user.userId.updateAt,
                    active: user.active,
                    status: user.status,
                })
            });
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
