const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    chid: {
        type: String,
        require: true
    },  
    course:{
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    chapterType:{
        type: String,
        required: true
    },
    video:[{
        videoTitle: {
            type: String,
        },
        watchId: {
            type: String
        }
    }],
    quiz:[{
        questionText: {
            type: String,
        },
        options: [String],
        solution: {
            type: String,
            default: ''
        }
    }]    

})

module.exports = Chapter = mongoose.model('chapter',ChapterSchema);