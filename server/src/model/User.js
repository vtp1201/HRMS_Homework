const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: { type: Schema.Types.String, required: true},
        password: { type: Schema.Types.String },
        googleId: { type: Schema.Types.String },
        email: { type: Schema.Types.String },
        image: { type: Schema.Types.String},
        role: { 
            type:Schema.Types.ObjectId, 
            required: true
        },
    },
    {
        timestamps: true,
    }
)

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});


module.exports = mongoose.model('User', User);
