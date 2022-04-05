const Document = require('../model/Document');
const Confirm = require('../model/Confirm');
const fs = require('fs');
const User = require('../model/User');

class documentController {
    // GET /documents?perPage=5&page=1 ( user )
    async getAllDocumentsByUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await Confirm.count();
            const confirm = await Confirm.find({
                    user: req.user._id,
                    deleted: false,
                },{
                    _id : false,
                    docId: true,
                    status: true,
                })
                //.find({user: req.user._id})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .populate('docId', ['title','url']);
            res.status(200);
            return res.json({
                documents: confirm,
                current: page,
                pages: Math.ceil(count / perPage),
            });
        } catch (err) {
            res.status(400);
            return res.json({
                msg: "can't find any doc"
            });
        }
    }
    // POST /documents
    async createDocument(req, res) {
        if(!req.body.title) {
            req.body.title = req.file.originalname;
        }
        const newDoc = new Document({
            ...req.body,
            url: req.file.filename,
            //postedBy: req.body.userId,
            postedBy: req.user._id,
        });
        try {
            const result = await newDoc.save();
            const users = await User.find({},{_id: true});
            const confirms = users.map(user => {
                return new Confirm({
                    docId: result._id,
                    userId: user._id,
                    active: false,
                })
            })
            const listConfirm = await Confirm.insertMany(confirms);
            res.status(200);
            return res.json({
                msg: "create sucess",
                docIdId: result._id,
            });
        } catch (err) {
            console.log(err);
            res.status(400);
            return res.json({
                msg: "Can't create document, please try later",
            });
        }
    }
    // PUT /documents
    async updateDocument(req, res) {
        try {
            if (req.file.filename){
                req.body.url = req.file.filename;
            }
            const result = await Document.updateOne({
                    _id: req.params.id,
                }, req.body);

            if (result.matchedCount !== 1) {
                res.status(400);
                return res.json({
                    msg: "document id does not exits",
                });
            }
            if (req.body.url){
                const updateConfirm = await Confirm.updateMany({
                    docId: req.params.id,
                }, {
                    status: 'Open',
                })
                console.log(updateConfirm);
            }
            res.status(200);
            return res.json({
                msg: "update sucess",
            });
        } catch (err) {
            res.status(400);
            return res.json({
                msg: "Can't update document, please try later",
            });
        }
    }
    // DELETE /documents/:id
    async deleteDocument(req, res) {
        try {
            const result = await Document.delete({
                _id: req.params.id
            });

            if (result.deletedCount !== 1) {
                res.status(404);
                return res.json({
                    msg: 'document id wrong',
                });
            }
            const deleteConfirm = await Confirm.delete({
                docId: req.params.id,
            })
            res.status(200);
            return res.json({
                status: 'success',
            });
        } catch (err) {
            res.status(400);
            return res.json({
                msg: "Can't delete document, please try later",
            });
        }
    }
}

function deleteFile(file) {
    try {
        fs.unlinkSync(file.name);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = new documentController();