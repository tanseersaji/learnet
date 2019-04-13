const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema  = new Schema({
    cid:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    prize:{
        type: String,
        required: true
    },
    thumbUrl:{
        type: String,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    outcomes:[{
        outcome:[
            String    
        ]
    }],
    isPublic:{
        type: Boolean,
        required: true
    },
    syllabus:[
        {
            chapter:{
                type: Schema.Types.ObjectId,
                ref: 'chapter'
            }
        }
    ],
    subscriber:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ]
  
})


module.exports = Course = mongoose.model('course',CourseSchema)