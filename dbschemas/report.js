const mongoose = require("./db");
var ReportSchema = new mongoose.Schema({
    deadline:{
       type:Date,
       required:true
    },
    submitted_date:{
        type:Date,
        required:true
    },
    report_start:{
        type:Date,
        required:true
    },
    report_end:{
        type:Date,
        required:true
    },
    student_id:{
        type:Number,
        required:true
    },
    professor_id:{
        type:Number,
        required:true
    },
    report:{
        type:Text,
        required:true
    }
});