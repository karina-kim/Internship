var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Student = require('./dbschemas/student');
var Professor = require('./dbschemas/professor');

// Register
router.get("/",function (req,res) {
    res.render('about/main', { title: 'Main Page'});
});

router.get("/error/",function (req,res) {
    res.render('error');
});
router.get("/profile",function (req,res) {
    res.render("profile/main");
});

router.get('/register/student', function (req, res) {
    res.render('registration/student/main');
});

// Login
router.get('/login/student', function (req, res) {
    res.render('login/student/main');
});

// Register Student
router.post('/register/student', function (req, res) {
    var firstName = req.body.first_name;
    var secondName = req.body.second_name;
    var email = req.body.email;
    var company = req.body.company;
    var location = req.body.work_location;
    var supervisorName = req.body.supervisor_name;
    var supervisorSurname = req.body.supervisor_surename;
    var supervisorContact = req.body.supervisor_contact_info;
    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    var idd = req.body.idd;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    //req.checkBody('firstName', 'First name is required').notEmpty();
    //req.checkBody('secondName', 'Second name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('idd', 'ID is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('registration/student/main', {
            errors: errors
        });
    }
    else {
        //checking for email and username are already taken
        Student.findOne({ username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }}, function (err, student) {
            Student.findOne({ email: {
                    "$regex": "^" + email + "\\b", "$options": "i"
                }}, function (err, Email) {
                if (student || Email) {
                    console.log("Error with username or email");
                    res.render('registration/student/main', {
                        username: username,
                        email: Email
                    });
                }
                else {
                    var newStudent = new Student({
                        email: email,
                        first_name: firstName,
                        second_name: secondName,
                        company: company,
                        work_location: location,
                        supervisor_name: supervisorName,
                        supervisor_surename: supervisorSurname,
                        supervisor_contact_info: supervisorContact,
                        start_date: startDate,
                        end_date: endDate,
                        studentID: idd,
                        username: username,
                        password: password
                    });
                    Student.createStudent(newStudent, function (err, st) {
                        if (err) throw err;
                        console.log(st);
                    });
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/login/student');
                }
            });
        });
    }
});

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/');
});

router.post("/contact",function (req,res) {
    console.log(req.body);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yersultan.nagashtay@nu.edu.kz',
            pass: '7084187179eE'
        }
    });
    var mailOptions = {
        from:req.body.email,
        to: 'karina.kim@nu.edu.kz', // list of receivers
        subject: 'Internship Management Program ✔', // Subject line
        text: "Message:\n"+req.body.message + "\nfrom:"+req.body.email,
    };
    transporter.sendMail(mailOptions, function (error)  {
        if (error) {
            return console.log(error);

        }
        return res.send('Message send!');
    });

});

router.post('/login/student',
    passport.authenticate('local1', { successRedirect: '/profile', failureRedirect: '/', failureFlash: true })
);

passport.use('local1', new LocalStrategy(
    function (username, password, done) {
        console.log(username,password);
        console.log("I am here");
        Student.getStudentByUsername(username, function (err, student) {
            if (err) throw console.log(err);
            if (!student) {
                return done(null, false, { message: 'Unknown User' });
            }
        Student.compareStudentPassword(password, student.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                console.log("Error here 6");
                return done(null, student);
            } else {
                console.log("Error here password");
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
        console.log("I am again");
}));

passport.serializeUser(function (student, done) {
    console.log("Error here 0");
    done(null, student.id);
});

passport.deserializeUser(function (id, done) {
    console.log("Error here 3");
    Student.getStudentById(id, function (err, student) {
        console.log("Error here 4");
        done(err, student);
    });
});


router.get('/register/professor', function (req, res) {
    res.render('registration/professor/main');
});

// Login
router.get('/login/professor', function (req, res) {
    res.render('login/professor/main');
});

router.post('/register/professor', function (req, res) {
    var firstName = req.body.first_name;
    var secondName = req.body.second_name;
    var email = req.body.email;
    var idd = req.body.idd;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    //req.checkBody('firstName', 'First name is required').notEmpty();
    //req.checkBody('secondName', 'Second name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('idd', 'ID is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('registration/professor/main', {
            errors: errors
        });
    }
    else {
        //checking for email and username are already taken
        Professor.findOne({ username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }}, function (err, professor) {
            Professor.findOne({ email: {
                    "$regex": "^" + email + "\\b", "$options": "i"
                }}, function (err, Email) {
                if (professor || Email) {
                    console.log("Error with username or email");
                    res.render('registration/student/main', {
                        username: username,
                        email: Email
                    });
                }
                else {
                    var newProfessor = new Professor({
                        email: email,
                        first_name: firstName,
                        second_name: secondName,
                        professorID: idd,
                        username: username,
                        password: password
                    });
                    Professor.createUser(newProfessor, function (err, st) {
                        if (err) throw err;
                        console.log(st);
                    });
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/login/professor');
                }
            });
        });
    }
});

router.post('/login/professor',
    passport.authenticate('local2', {successRedirect: '/profile', failureRedirect: '/login/professor', failureFlash: true }),
    function (req, res) {
        res.redirect('about/main');
    });

passport.use('local2', new LocalStrategy(
    function (username, password, done) {
        console.log("USE");
        Professor.getProfessorByUsername(username, function (err, professor) {
            if (err) throw err;
            if (!professor) {
                return done(null, false, { message: 'Unknown User' });
            }

            Professor.compareProfessorPassword(password, professor.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, professor);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));


module.exports = router;