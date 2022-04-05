const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Role = new Schema(
    {
        roleName: { 
            type: Schema.Types.String, 
            required: true
        },
        description: {
            type: Schema.Types.String, 
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Role', Role);