const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Document = new Schema(
    {
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        title: { type: Schema.Types.String},
        category: { type: Schema.Types.String},
        description: { type: Schema.Types.String},
        url: { type: Schema.Types.String},
    },
    {
        timestamps: true,
    }
)

Document.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});


module.exports = mongoose.model('Document', Document);
