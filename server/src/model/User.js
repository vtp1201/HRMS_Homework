const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: { type: Schema.Types.String, required: true, unique: true },
        password: { type: Schema.Types.String },
        googleId: { type: Schema.Types.String },
        email: { type: Schema.Types.String },
        image: { type: Schema.Types.String},
        isAdmin: { type:Schema.Types.Boolean, required: true },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', User);
