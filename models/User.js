const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userUid:{
        type: String,
        required: true
    },
    courses:[
        {
            course: {
                type: Schema.Types.ObjectId,
                ref: 'course'
            }
        }
    ]
})

module.exports = User = mongoose.model('user',UserSchema);