const router = require("express").Router();
const students_controller = require("../controllers/students.controllers");
const courses_controller = require("../controllers/courses.controller");

router.route("/students")
.get(students_controller.getAll)
.post(students_controller.addOne);

router.route("/students/:studentId")
.get(students_controller.getOne)
.put(students_controller.replaceOne)
.patch(students_controller.partialUpdateOne)
.delete(students_controller.deleteOne);

router.route("/students/:studentId/courses")
.get(courses_controller.getAll)
.post(courses_controller.addOne);

router.route("/students/:studentId/courses/:courseId")
.get(courses_controller.getOneById)
.patch(courses_controller.partiallyUpdateOne)
.delete(courses_controller.deleteOne);

module.exports=router;