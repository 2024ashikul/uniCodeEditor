const mongoose = require('mongoose')

const LessonContentSchema = new mongoose.Schema({
    type : {
        type : String,
        enum : ['text','image','video'],
        required : true
    },
    content : {
        type : String,
        required : true
    }
})

const LessonSchema = new mongoose.Schema({
  id : {type : Number , required : true},
  title: { type: String, required: true }, 
  contents: [LessonContentSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('LessonM', LessonSchema);