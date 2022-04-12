const Document = require('../model/Document');
const Confirm = require('../model/Confirm');
const fs = require('fs');
const User = require('../model/User');

class documentController {
    // GET /document/:id
    async getDocumentByDocId(req, res) {
        try {
            const doc = await Document.findOne({ _id: req.params.id});
            res.status(200);
            return res.json(doc);
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "Can't find document"
            });
        }
    }
    // GET /document/all?perPage=5&page=1
    async getAllDocument(req, res) {
        const perPage = Number(req.query.perPage) || 10;
        const page = Number(req.query.page) || 1;
        try {
            const count = await Document.count();
            const documents = await Document.find()
                .limit(perPage)
                .skip((perPage * page) - perPage)
                .sort('-createdAt')
            if(documents.length === 0) {
                res.status(400);
                return res.json({
                    msg: "Bad query",
                    pages: Math.ceil(count / perPage),
                });
            }
            res.status(200);
            return res.json({
                documents: documents,
                current: page,
                pages: Math.ceil(count / perPage),
            });
        } catch (error) {
            res.status(400);
            return res.json({
                msg: `can't find any doc`
            });
        }
    }
    // GET /document?perPage=5&page=1 ( user )
    async getAllDocumentsByUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = 'updateAt'
        try {
            const count = await Confirm.count({
                userId: req.user._id,
                active: true,
                deleted: false,
            });
            const confirm = await Confirm.find({
                    userId: req.user._id,
                    active: true,
                },{
                    _id : false,
                    docId: true,
                    status: true,
                })
                //.find({user: req.user._id}
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ 'updateAt' : -1})
                .populate('docId', ['title','url','updatedAt']);
            if(confirm.length === 0) {
                res.status(401);
                return res.json({
                    msg: "Bad query",
                    pages: Math.ceil(count / perPage),
                });
            }
            const docs = confirm.map(confirm => {
                return {
                    docId : confirm.docId._id,
                    title: confirm.docId.title,
                    url: confirm.docId.url,
                    updatedAt: confirm.docId.updatedAt,
                    status: confirm.status
                }
            })
            res.status(200);
            return res.json({
                documents: docs,
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
        if(!req.file){
            res.status(400);
            return res.json({
                msg: "import document file (pdf,doc,docx) first",
            });
        }
        if(!req.body.title) {
            req.body.title = req.file.originalname.split(".")[0];
        }
        const newDoc = new Document({
            ...req.body,
            url: `uploads/${req.file.filename}`,
            //postedBy: req.body.userId,
            postedBy: req.user._id,
        });
        try {
            const result = await newDoc.save();
            const users = await User.find({role: 0},{_id: true});
            const confirms = users.map(user => {
                return new Confirm({
                    docId: result._id,
                    userId: user._id,
                    active: false,
                });
            })
            const listConfirm = await Confirm.insertMany(confirms);
            res.status(200);
            return res.json({
                msg: "create success",
                docId: result._id,
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
            const doc = await Document.findOne({_id: req.params.id});
            if (!doc) {
                res.status(400);
                return res.json({
                    msg: "This document does not exist",
                });
            }
            if (req.file){
                req.body.url = `uploads/${req.file.filename}`;
                const deleted = deleteFile(doc);
                const updateConfirm = await Confirm.updateMany({
                    docId: req.params.id,
                }, {
                    status: 'Open',
                });
            }
            const result = await Document.updateOne({
                    _id: req.params.id,
            }, req.body);
            res.status(200);
            return res.json({
                msg: "update success",
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
            if (result.modifiedCount !== 1) {
                res.status(400);
                return res.json({
                    msg: 'This document does not exist',
                });
            }
            const deleteConfirm = await Confirm.delete({
                docId: req.params.id,
            });
            res.status(200);
            return res.json({
                msg: 'success',
                deletedConfirm : deleteConfirm.modifiedCount
            });
        } catch (err) {
            res.status(400);
            return res.json({
                msg: "Can't delete document, please try later",
            });
        }
    }

    // GET / document/trash
    async trashDocument(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await Document.count({ deleted : true});
            const documents = await Document.find({ deleted : true })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ 'updateAt' : -1})
            if(documents.length === 0) {
                res.status(400);
                return res.json({
                    msg: "Bad query",
                    pages: Math.ceil(count / perPage),
                });
            }
            res.status(200);
            return res.json({
                documents: documents,
                current: page,
                pages: Math.ceil(count / perPage),
            });
        } catch (error) {
            res.status(400);
            return res.json({
                msg: `can't find any doc`
            });
        }
    }

    // PATCH /document/:id/restore
    async restoreDocument(req, res) {
        try {
            const result = await Document.restore({
                _id: req.params.id
            });
            console.log(result);
            const restoreConfirm = await Confirm.restore({
                docId: req.params.id,
            });
            console.log(restoreConfirm);
            res.status(200);
            return res.json({
                msg: 'success',
            });
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "Can't restore document, please try later",
            });
        }
    }
    // DELETE /documents/:id/destroy
    async destroyDocument(req, res) {
        try {
            const result = await Document.deleteOne({
                _id: req.params.id
            });
            console.log(result);
            const deleteConfirm = await Confirm.deleteMany({
                docId: req.params.id,
            });
            console.log(deleteConfirm);
            res.status(200);
            return res.json({
                msg: 'success',
            });
        } catch (error) {
            res.status(400);
            return res.json({
                msg: "Can't destroy document, please try later",
            });
        }
    }
}

function deleteFile(file) {
    try {
        fs.unlinkSync(`src/public/${file.url}`);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = new documentController();