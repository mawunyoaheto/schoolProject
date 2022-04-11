const mongoose = require("mongoose");
const STUDENTS = mongoose.model(process.env.STUDENTS_MODEL);


const getAll = (req, res) => {
    console.log("GET All review controller ");
    const { studentId, response } = _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        STUDENTS.findById(studentId).select("courses").exec((err, student) => _findAll(err, student, res, response));
    }
};

const getOneById = (req, res) => {
    const { studentId, courseId, response } = _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {

        STUDENTS.findById(studentId).select("courses").exec((err, student) => _findOneById(err, student, req, res, response));
    }
};

const addOne = (req, res) => {
    const { studentId, response } = _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        response.status = process.env.HTTP_CREATE_STATUS_CODE;
        STUDENTS.findById(studentId).select("courses").exec((err, student) => _addCourse(err, student, req, res, response));
    }
};

const partiallyUpdateOne = (req, res) => {
    const { studentId, response } = _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        response.status = process.env.HTTP_UPDATE_STATUS_CODE;
        STUDENTS.findById(studentId).select("courses").exec((err, student) => _partialUpdate(err, student, req, res, response));
    }
};

const deleteOne = (req, res) => {
    const { studentId, response } = _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse(req);

    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        response.status = process.env.HTTP_CREATE_STATUS_CODE;
        STUDENTS.findById(studentId).select("courses").exec((err, student) => _deleteOne(err, student, req, res, response));
    }
};

const _findAll = (err, student, res, response) => {

    if (err) {
        console.log("Error finding student courses");
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
    }
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
    else {

        if (student) {
            console.log("courses found");
            res.status(process.env.HTTP_READ_STATUS_CODE).json(student);
        } else {
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
            response.message = `No reviews found for student with given id: ${student._id}`;
            res.status(response.status).json(response.message);
        }

    }

};

const _findOneById = (err, student, req,res, response) => {

    if (err) {
        console.log("Error finding student course");
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(err);
    }
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
    else {

        let course = student.courses.id(req.params.courseId);
        if (course) {
            console.log("course found");
            res.status(process.env.HTTP_READ_STATUS_CODE).json(course);
        } else {
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
            response.message = `No course with given id: ${req.params.courseId} found for student with given id: ${student._id}`;
            res.status(response.status).json(response.message);
        }

    }

};

const _addCourse = (err, student, req, res, response) => {

    if (err) {
        console.log("Error finding student courses");
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
    }
    if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
    else {

        if (!student) {
            console.log("student not found");
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
            response.message = `No  student with given id: ${student._id} found`;
            res.status(process.env.HTTP_READ_STATUS_CODE).json(student.courses);
        } else {

            let course = {
                code: req.body.code,
                title: req.body.title,
                capacity: (req.body.capacity) ? parseInt(req.body.capacity, 10) : req.body.capacity
            };

            student.courses.push(course);
            student.save((err, student) => {
                if (err) {
                    res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                }
                res.status(response.status).json(student);
            });
        }
    }
};

const _partialUpdate = (err, student, req, res, response) => {

    if (err) {
        console.log("Error finding student course");
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(err);
    }
    if (response.status != process.env.HTTP_UPDATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
    else {

        if (!student) {
            console.log("student not found");
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;;
            response.message = `student with given id: ${student._id} found`;
            res.status(response.status).json(response.message);

        } else {

            let course = student.courses.id(req.params.courseId);

            if (course) {
                course.code = (req.body.code) ? req.body.code : course.code;
                course.title = (req.body.title) ? parseInt(req.body.title) : course.title;
                course.capacity = (req.body.capacity) ? parseInt(req.body.capacity) : course.capacity;

                student.save((err, student) => {
                    if (err) {
                        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                    }
                    res.status(response.status).json(student);
                });
            } else {
                console.log("course not found");
                response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;;
                response.message = `course with id: ${req.params.courseId} not found for student with given id: ${student._id}`;
                res.status(response.status).json(response.message);
            }
        }
    }
};

const _deleteOne = (err, student, req, res, response) => {
    if (err) {
        console.log("Error findingstudente review");
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(err);
    }
    if (response.status != process.env.HTTP_CREATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
    else {

        if (!student) {
            console.log("student not found");
            response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
            response.message = `student with given id: ${student._id} found`;
            res.status(response.status).json(response.message);

        } else {

            let course = student.courses.id(req.params.courseId);

            if (course) {
                course.remove();
                student.save((err, student) => {
                    if (err) {
                        res.status(process.env.HTTP_SERVER_ERROR_STATUS_CODE).json(err);
                    }
                    res.status(response.status).json("Delete Successful");
                });
            } else {
                console.log("course not found");
                response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;;
                response.message = `course with id: ${req.params.courseId} not found for student with given id: ${student._id}`;
                res.status(response.status).json(response.message);
            }
        }
    }
};
const _validateStudentIdAndCourseIdIdFromReqAndReturnStudentIdCourseIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { studentId: studentId, courseId: courseId } = req.params;

    if (req.params && studentId) {
        if (!mongoose.isValidObjectId(studentId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid studentId";
        }
    } else {
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = "Cannot find without studentId";
    }

    if (req.params && courseId) {
        if (!mongoose.isValidObjectId(courseId)) {
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = "Invalid courseId";
        }
    }

    return {
        studentId: studentId,
        courseId: courseId,
        response: response
    };
};


module.exports = {
    getAll,
    getOneById,
    addOne,
    partiallyUpdateOne,
    deleteOne
};