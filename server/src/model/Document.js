const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Document = new Schema(
    {
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        title: { type: Schema.Types.String, required: true},
        category: { type: Schema.Types.String},
        description: { type: Schema.Types.String},
        url: { type: Schema.Types.String, required: true},
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Document', Document);
