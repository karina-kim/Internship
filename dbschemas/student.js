var mongoose = require("./db");
var bcrypt = require('bcryptjs');

var StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    first_name:{
        type:String,
        required: true,
        trim:true
    },
    second_name:{
        type:String,
        required: true,
        trim:true
    },
    company:{
        type:String,
        trim:true
    },
    work_location:{
        type:String,
    },
    supervisor_name:{
        type:String,
        trim:true
    },
    supervisor_surename:{
        type:String,
        trim:true
    },
    supervisor_contact_info:{
        type:String
    },
    start_date:{
        type:Date
    },
    end_date:{
        type:Date
    },
    password: {
        type: String,
        required: true
    },
    studentID:{
        type:Number,
        required:true
    }
});
var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.createStudent = function(newStudent, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newStudent.password, salt, function(err, hash) {
            newStudent.password = hash;
            newStudent.save(callback);
        });
    });
}

module.exports.getStudentByUsername = function(username, callback){
    var query = {username: username};
    console.log("STUDENT USED");
    console.log(query);
    Student.findOne(query, callback);
}

module.exports.getStudentById = function(id, callback){
    Student.findById(id, callback);
}

module.exports.compareStudentPassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}