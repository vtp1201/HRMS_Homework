const Document = require('../model/Document');
const Confirm = require('../model/Confirm');

class documentController {
    // GET /documents
    async getAllDocumentsByUser(req, res) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        try {
            const confirm = await Confirm
                    .find({user: req.user._id})
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .populate('document');
            const doc = confirm.map(confirm => confirm.document);
            res.status(200);
            return res.json({
                documents: doc,
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
        if (req.body.title && req.body.category && req.body.description) {
            res.status(400);
            return req.json({
                msg: "add all field",
            })
        }
        const newDoc = new Document({
            ...req.body,
            url: req.files.url,
            postedBy: req.user._id,
        });
        try {
            const result = await newDoc.save();
            console.log(result);
        } catch (err) {
            res.status(400);
            return req.json({
                msg: "Can't create document, please try later",
            });
        }
    }
    // PUT /documents
    async updateDocument(req, res) {
        if (req.body.title && req.body.category && req.body.description) {
            res.status(400);
            return req.json({
                msg: "add all field",
            })
        }

        const result = await Document.updateOne()
    }
    // PUT /documents
    async deleteDocument(req, res) {
        try {
            const result = await Document.deleteOne({_id: req.params.id});
            console.log(result);
            res.status(200);
            return res.json({
                status: 'success',
            });
        } catch (err) {
            res.status(400);
            return res.json({
                status: 'failure',
            });
        }
    }
}

module.exports = documentController;