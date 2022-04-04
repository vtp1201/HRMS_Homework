const Confirm = require('../model/Confirm');
const User = require('../model/User');

class userController {
    // GET /user/all (Admin)
    async getAllUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await User.count();
            const users = await User.find({}, {
                    name: true,
                    _id: true,
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
    async getUsersSyncByIdDoc(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await Confirm.count({
                document: req.params.id
            });
            const users = await Confirm.find(
                {
                    document: req.params.id
                }, {
                    _id: false,
                    document: false,
                })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .populate('user');
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
    async getUsersNotSyncByIdDoc(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            Promise.all([ User.find(), 
                Confirm.find({
                    document: req.params.id
                }, {
                    user: true,
                })
                .populate('user')
            ]).then(([all, sync])=> {
                const notSync = all.filter(x => !sync.includes(x))
                                .concat(sync.filter(x => !all.includes(x)));
            })
            /* const count = await Confirm.count({
                document: req.params.id
            });
            const users = await Confirm.find({
                    document: req.params.id
                }, {
                    _id: false,
                    document: false,
                })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .populate('user'); */
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
