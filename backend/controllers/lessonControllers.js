const { Lesson, LessonM } = require("../models");


exports.delete = async (req ,res) => {
    const {lessonId} = req.body;
    try{
        await Lesson.destroy({
            where : {
                id : lessonId
            }
        });
        await LessonM.deleteOne({ id: lessonId });
        return res.status(201).json({message : 'Deleted the lesson successfully'})
    }catch(err){
        console.log(err);
    }
}