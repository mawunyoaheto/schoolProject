const mongoose = require('mongoose');

const CoursesSchema = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    title:{
        type:String,
        require: true
    },
    capacity:Number
});

const StudentsSchema = mongoose.Schema({
    name: String,
    gpa:Number,
    courses:[CoursesSchema]
});
mongoose.model(process.env.STUDENTS_MODEL, StudentsSchema, process.env.STUDENTS_COLLECTION);