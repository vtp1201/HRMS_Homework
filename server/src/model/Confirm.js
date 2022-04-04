const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Confirm = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        document: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
        },
        status: {
            type: Schema.Types.String,
            required: true,
            default: 'Open',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Confirm', Confirm);
