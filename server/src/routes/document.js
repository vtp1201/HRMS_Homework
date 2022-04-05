const express = require('express');
const multer = require('multer');
const passport = require("passport");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

const documentController = require('../controller/documentController');
const {checkAdmin} = require('../middleware/authMiddleware');

router.all('*', passport.authenticate("jwt", { session: false }));
router.get('/', documentController.getAllDocumentsByUser); // check
router.post('/', checkAdmin, upload.single('document'), documentController.createDocument); //(check)
router.put('/:id', checkAdmin, upload.single('document'), documentController.updateDocument); //check
router.delete('/:id', checkAdmin, documentController.deleteDocument);  // check

module.exports = router;
