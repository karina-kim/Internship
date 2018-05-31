var express = require('express');
var router = express.Router();

// Get Homepage

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;