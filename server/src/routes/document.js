const express = require('express');
const multer = require('multer');
const passport = require("passport");
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const dot = path.extname(file.originalname);
        if (dot !== ".pdf" && dot !== ".doc" && dot !== ".docx") {
          return cb(null, false, new Error('just pdf, doc, docx'));
        }
        cb(null, true);
    }
});

const documentController = require('../controller/documentController');
const {checkAdmin} = require('../middleware/authMiddleware');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/all', checkAdmin, documentController.getAllDocument);
router.get('/trash', checkAdmin, documentController.trashDocument);
router.get('/:id', documentController.getDocumentByDocId);
router.get('/', documentController.getAllDocumentsByUser); // check
router.post('/', checkAdmin, upload.single('file'), documentController.createDocument); //(check)
router.put('/:id', checkAdmin, upload.single('file'), documentController.updateDocument); //check
router.delete('/:id', checkAdmin, documentController.deleteDocument);  // check
router.patch('/:id/restore', checkAdmin, documentController.restoreDocument);
router.delete('/:id/destroy', checkAdmin, documentController.deleteDocument);

module.exports = router;
