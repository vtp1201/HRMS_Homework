const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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
        active: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
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

Confirm.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Confirm', Confirm);
