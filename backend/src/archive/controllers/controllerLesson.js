const { Lesson, LessonM } = require("../models");

exports.delete = async (req, res) => {
    const { lessonId } = req.body;
    try {
        await Lesson.destroy({
            where: {
                id: lessonId
            }
        });
        await LessonM.deleteOne({ id: lessonId });
        return res.status(201).json({ message: 'Deleted the lesson successfully' })
    } catch (err) {
        console.log(err);
    }
}

exports.create = async (req, res) => {
    try {
        const { contents, title, roomId } = req.body;
        const newLesson = await Lesson.create({
            title: title,
            roomId: roomId
        });
        const newLessonM = new LessonM({
            id: newLesson.id,
            title: title,
            contents: contents
        })
        await newLessonM.save();
        console.log(newLessonM);
        return res.status(201).json({ message: 'Created a new lesson' })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not create lesson' })
    }
}

exports.update = async (req, res) => {
    try {
        const { contents, title, lessonId } = req.body;
        const lesson = await Lesson.findOne({
            where: {
                id: lessonId
            }
        });
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        lesson.title = title || lesson.title;
        await lesson.save();
        const lessonM = await LessonM.findOne({ id: lessonId });

        if (!lessonM) {
            const newLessonM = new LessonM({
                id: lessonId,
                title,
                contents,
            });
            await newLessonM.save();
        } else {
            lessonM.title = title || lessonM.title;
            lessonM.contents = contents || lessonM.contents;
            await lessonM.save();
        }
        return res.status(200).json({ message: "Lesson updated successfully" });
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not create lesson' })
    }
}

exports.fetchone = async (req, res) => {
    try {
        const { lessonId } = req.body;
        const lesson = await LessonM.findOne({ id: lessonId })
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        return res.status(201).json({ lesson })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not fetch lesson' })
    }
}

exports.fetchall = async (req, res) => {
    try {
        const { roomId } = req.body;
        const lessons = await Lesson.findAll({
            where: { roomId: roomId }
        })
        return res.status(200).json({ message: 'Fetched lessons', lessons })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'Could not fetch lesson' })
    }
}