const Document = require('../model/Document');
const Confirm = require('../model/Confirm');
const User = require('../model/User');

class confirmController{
    // GET /confirm/:id (admin)
    async getAllConfirmByIdDoc(req, res) {
        try {
            const allConfirm = await Confirm.find({ 
                    docId: req.params.id,
                },{    
                    userId: true,
                    status: true,
                })
                .populate('userId', ['name', 'image']);

            res.status(200);
            return res.json(allConfirm); 
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                msg: "Can't get confirm, please try later",
            });  
        }
    }
    // POST /confirm/ (admin)
    async addRoleByIdDoc(req, res) {
        try {
            const { docId , users } = req.body;
            const document = await Document.findById(docId);
            if (!document) {
                res.status(400);
                return res.json({
                    msg: "Document Id wrong, please try later!",
                });
            }
            users.forEach(async e => {
                await Confirm.findOneAndUpdate({
                    userId: e.userId,
                    docId: docId
                }, {
                    active: true,
                })
            });
            res.status(200);
            return res.json({
                msg: "success"
            });
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                msg: "Can't add confirm, please try later",
            });  
        }
    }
    // PUT /confirm/ (user)
    async updateStatusConfirm(req, res) {
        try {
            const { userId, docId, status } = req.body;
            const result = await Confirm.updateOne({
                userId: userId,
                docId: docId,
            }, {
                status: status,
            })
            if (result.matchedCount !== 1) {
                res.status(400);
                return res.json({
                    msg: "Your info wrong, please try later",
                });
            }
            res.status(200);
            return res.json({
                msg: "update success!",
            });
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "Can't update confirm, please try later",
            });
        }
    }
}

module.exports = new confirmController();
