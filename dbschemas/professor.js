var mongoose = require("./db");
var bcrypt = require('bcryptjs');

var ProfessorSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    professorID:{
        type:Number,
        required:true
    }
});
var Professor = module.exports = mongoose.model('Professor', ProfessorSchema);

module.exports.createProfessor = function(newProfessor, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newProfessor.password, salt, function(err, hash) {
            newProfessor.password = hash;
            newProfessor.save(callback);
        });
    });
}

module.exports.getProfessorByUsername = function(username, callback){
    var query = {username: username};
    console.log("PROFESSOR USED ")
    console.log(query);
    Professor.findOne(query, callback);
}

module.exports.getProfessorById = function(id, callback){
    Professor.findById(id, callback);
}

module.exports.compareProfessorPassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}