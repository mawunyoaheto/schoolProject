const mongoose = require("mongoose");
const STUDENTS = mongoose.model(process.env.STUDENTS_MODEL);


const getAll = (req, res) => {

    console.log('Get All Controller');
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    let offset = parseInt(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseInt(process.env.DEFAULT_FIND_COUNT, 10);
    let max = parseInt(process.env.MAX_FIND_COUNT, 10);
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    if (isNaN(offset) || isNaN(count)) {
        console.log('Offset or Count is not a number');
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = 'offset and count must be digit';
    }
    if (count > max) {
        console.log('Count greater than max');
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = 'Count cannot be greater than' + max;
    }

    STUDENTS.find().skip(offset).limit(count).exec((err, students) => {
        console.log('Found Movies', students.length);
        res.status(process.env.HTTP_READ_STATUS_CODE).json(students);
    });
};


const getOne = (req, res) => {
    const { studentId, response } = _validatestudentIdFromReqAndReturnstudentIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        STUDENTS.findById(studentId).exec((err, student) => _getOne(err, student, res, response));
    }
};

const deleteOne = (req, res) => {
    const { studentId, response } = _validatestudentIdFromReqAndReturnstudentIdAndResponse(req);
    if (response.status != HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        STUDENTS.deleteOne({ _id: studentId }, _deleteOne(err, student, response));
    }
};


let replaceOne = (req, res) => {
    const { studentId, response } = _validatestudentIdFromReqAndReturnstudentIdAndResponse(req);
    response.status = process.env.HTTP_UPDATE_STATUS_CODE;
    if (response.status != process.env.HTTP_UPDATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        STUDENTS.findById(studentId).exec((err, student) => _findAndReplaceOne(err, student, req, res, response));
    }
};

let partialUpdateOne = (req, res) => {
    console.log('patch controller called');
    const { studentId, response } = _validatestudentIdFromReqAndReturnstudentIdAndResponse(req);
    if (response.status != process.env.HTTP_READ_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        response.status = process.env.HTTP_UPDATE_STATUS_CODE;
        STUDENTS.findById(studentId).exec((err, student) => _findAndPartiallyUpdate(err, req, student, res, response));
    }
};

let addOne = (req, res) => {

    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };

    let newStudent = {};

    newStudent.name = req.body.name;
    newStudent.gpa = parseFloat(req.body.gpa);
    newStudent.courses = [];

    STUDENTS.create(newStudent, (err, savedStudent) => _saveNewStudentAndSendResponse(err, savedStudent, response, res));
};

const _validatestudentIdFromReqAndReturnstudentIdAndResponse = (req) => {
    const response = {
        status: process.env.HTTP_READ_STATUS_CODE,
        message: {}
    };
    const { studentId } = req.params;
    if (req.params && studentId) {
        if (!mongoose.isValidObjectId(studentId)) {
            console.log('Invalid studentId');
            response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
            response.message = 'Invalid studentId';
        }
    } else {
        console.log('studentId not provided');
        response.status = process.env.HTTP_BAD_REQUEST_STATUS_CODE;
        response.message = 'studentId not provided';
    }
    return {
        studentId: studentId,
        response: response
    };
};

const _getOne = (err, student, res, response) => {
    if (err) {
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(response.message);
    } else if (!student) {
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = `Student Not found`;
        console.log('Student Not Found');
        res.status(response.status).json(response.message);
    } else {
        console.log('Found Student');
        res.status(response.status).json(student);
    }
};

const _findAndReplaceOne = (err, student, req, res, response) => {
    if (err) {
        console.log('Error finding student');
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
    } else if (!student) {
        console.log('student with given id not found');
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = 'student with given id not found';
    }
    if (response.status !== process.env.HTTP_UPDATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        student.name = req.body.name;
        student.gpa = (req.body && req.body.gpa) ? parseFloat(req.body.gpa) : req.body.gpa;
        student.courses = req.body.courses;
        student.save((err, student) => {
            if (err) {
                response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
                response.message = err;
                res.status(response.status).json(response.message);
            } else {
                res.status(process.env.HTTP_UPDATE_STATUS_CODE).json
                    (student);
            }

        });
    }
};

const _findAndPartiallyUpdate = (err, req, student, res, response) => {
    if (err) {
        console.log('Error finding student');
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
    } else if (!student) {
        console.log('student with given id not found');
        response.status = process.env.HTTP_NOT_FOUND_STATUS_CODE;
        response.message = 'student with given id not found';
    }
    if (response.status !== process.env.HTTP_UPDATE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        student.name = req.body.name || student.name;
        student.gpa = parseFloat(req.body.gpa) || student.gpa;
        student.courses = req.body.courses || student.courses;
        student.save((err, student) => {
            if (err) {
                response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
                response.message = err;
                res.status(response.status).json(response.message);
            } else {
                res.status(process.env.HTTP_UPDATE_STATUS_CODE).json
                    (student);
            }

        });
    }
};
const _deleteOne = (err, student, response) => {
    if (err) {
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(response.message);
    } else {
        console.log('Deleted student');
        response.status = process.env.HTTP_DELETE_STATUS_CODE;
        res.status(response.status).json('Delete Successful');
    }
};


const _saveNewStudentAndSendResponse = (err, savedStudent, response, res) => {
    if (err) {
        response.status = process.env.HTTP_SERVER_ERROR_STATUS_CODE;
        response.message = err;
        res.status(response.status).json(response.message);
    } else {
        res.status(response.status).json(savedStudent);
    }
};
module.exports = {
    getAll,
    getOne,
    addOne,
    replaceOne,
    partialUpdateOne,
    deleteOne
};