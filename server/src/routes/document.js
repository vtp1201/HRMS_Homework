const express = require('express');
const multer = require('multer');

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

router.get('/', documentController.getAllDocumentsByUser); // check
router.post('/', upload.single('document'), documentController.createDocument); //(check)
router.put('/:id', documentController.updateDocument); //check
router.delete('/:id', documentController.deleteDocument);  // check




module.exports = router;
