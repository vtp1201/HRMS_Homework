const Document = require('../model/Document');
const Confirm = require('../model/Confirm');

class documentController {
    // GET /documents?perPage=5&page=1 ( user )
    async getAllDocumentsByUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const count = await Confirm.count();
            const confirm = await Confirm.find({
                    user: req.query.userId
                },{
                    _id: false,
                    user: false,
                })
                //.find({user: req.user._id})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .populate('document');
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
        const newDoc = new Document({
            ...req.body,
            url: req.file.filename,
            postedBy: req.body.userId,
            //postedBy: req.user._id,
        });
        try {
            const result = await newDoc.save();
            res.status(200);
            return res.json({
                msg: "create sucess",
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
            const result = await Document.updateOne(req.body);
            if (result.matchedCount !== 1) {
                res.status(400);
                return res.json({
                    msg: "document id do not exits",
                });
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
    // DELETE /documents
    async deleteDocument(req, res) {
        try {
            const result = await Document.deleteOne({_id: req.params.id});
            if (result.deletedCount !== 1) {
                res.status(400);
                return res.json({
                    msg: 'document id wrong',
                });
            }
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

module.exports = new documentController();