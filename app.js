const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
// const studentModule = require('./static/js/student')
const port = 3000;
const hostname = '127.0.0.1'

const app = express();
app.use('/static', express.static('static'));
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// database connection
mongoose.connect('mongodb://127.0.0.1:27017/examPortal', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

// student schema and model
const studentSchema = new mongoose.Schema({
    name : String,
    department : String,
    studentId : String,
    password : String
});
const Student = new mongoose.model('Student', studentSchema, 'student');

// question schema and model
const questionSchema = new mongoose.Schema({
    testName : String,
    department : String,
    question : String,
    optionA : String,
    optionB : String,
    optionC : String,
    optionD : String,
    correctOption : String
})
const Question = new mongoose.model('Question', questionSchema, 'question');

// test schema and model
const testSchema = new mongoose.Schema({
    testName : String,
    department : String,
    dateTime : Date,
    testDuration : Number
})
const Test = new mongoose.model('Test', testSchema, 'test');

// score schema and model
const scoreSchema = new mongoose.Schema({
    studentId : String,
    testName : String,
    department : String,
    marks : Number
})
const Score = new mongoose.model('Score', scoreSchema, 'score');

app.get('/', (req, res)=>{
    res.status(200).render('index', {alert: false});
})
app.get('/about', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '/views/about.html'));
})
app.get('/team', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '/views/team.html'));
})
app.get('/contact', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '/views/contact.html'));
})

let isAdminLoggedIn = false;
let isStudentLoggedIn = false;
app.get('/admin', (req, res)=>{
    // console.log(req.body.testName);
    // res.status(200).sendFile(path.join(__dirname, '/views/admin.html'));
    // res.redirect('/');
    if(isAdminLoggedIn==true){
        res.status(200).render('admin', {alert:false})
    }
    else{
        res.redirect('/');
    }
})
app.get('/student', (req, res)=>{
    // if(isStudentLoggedIn==true){
    //     res.status(200).render('admin', {alert:false})
    // }
    // else{
    //     res.redirect('/');
    // }
    res.redirect('/');
})
app.post('/admin', (req, res)=>{
    isAdminLoggedIn = true;
    const password = "password";
    if(req.body.adminPassword == password){
        res.status(200).render('admin', {alert:false})
    }else{
        res.status(200).render('index',{alert : true});
    }
})
app.post('/student', (req, res)=>{
    Student.find(req.body, {_id:0}, (error, students)=>{
        if(students!=undefined && students.length>0){
            let student = students[0];
            Test.find({"department" : `${student.department}`}, {_id:0, __v:0}, (error, tests)=>{
                
                upcomingTests = new Array(), expiredTests = new Array();
                Array.from(tests).forEach((test)=>{
                    let query = {
                        studentId: student.studentId,
                        testName : test.testName
                    }
                    let isExpired = 0;
                    Score.find(query, 'marks', (error, scores)=>{
                        if(scores.length>0){
                            let score = scores[0];
                            if(score.marks>=0 || ((test.dateTime) < ((new Date())-test.testDuration*60000))){
                                expiredTests.push({test:test, marks:score.marks});
                            }
                            else{
                                upcomingTests.push(test);
                            }
                        }
                    })
                })
            }).then(()=>{
                setTimeout(()=>{
                    let params = {
                        studentId:student.studentId, 
                        department: student.department,
                        password: req.body.password,
                        name: student.name, 
                        upcomingTests: upcomingTests, 
                        expiredTests: expiredTests,
                        alert: false
                    }; //to be extracted from db
                    res.status(200).render('student',params);
                },1000)
            })
        }
        else{
            res.status(200).render('index',{alert : true});
        }
    })
})
app.post('/newQuestion', (req, res)=>{
    let question = new Question(req.body);
    question.save().then(()=>{
        console.log("Question added to database");
    }).catch(()=>{
        console.log("Some error occured");
    })
    res.redirect('./admin');
})
app.post('/addStudent', (req, res)=>{
    let student = new Student(req.body);
    student.save().then(()=>{
        Test.find({department:req.body.department},{_id:0, __v:0}, (error, tests)=>{
            Array.from(tests).forEach(test=>{
                let score = new Score({
                    studentId: req.body.studentId,
                    testName: test.testName,
                    department: req.body.department,
                    marks: -1
                })
                score.save();
            })
        })
        console.log("Student added to database");
    }).catch(()=>{
        console.log("Some error occured");

    })
    res.redirect('./admin');
})
app.post('/scheduleTest', (req, res)=>{
    Question.find({testName : req.body.testName},(error, questions)=>{
        if(questions.length>0){
            let test = new Test(req.body);
            test.save().then(()=>{
                console.log("Test added to database");
            }).catch(()=>{
                console.log("Some error occured");
            })
            Student.find({department:req.body.department}, {_id:0},(error, students)=>{
                Array.from(students).forEach(student => {
                    let score = new Score({
                        studentId: student.studentId,
                        testName: req.body.testName,
                        department: student.department,
                        marks: -1
                    })
                    score.save();
                });
            })
            res.status(200).render('admin', {alert:false})
        }
        else{
            res.status(200).render('admin', {alert:true})
        }
    })
})

app.get('/test', (req, res)=>{
    let query = {
        testName: req.query.testName, 
        department: req.query.department
    }
    Question.find(query, {_id:0, __v:0}, (error, questions)=>{
        res.status(200).render('test', {testName: req.query.testName, questions: questions, testDuration: req.query.testDuration, alert:false})
    })
})

app.post('/updateMarks', (req, res)=>{
    let query = {
        studentId: req.body.studentId,
        testName: req.body.testName,
        department: req.body.department
    }
    Score.findOneAndUpdate(query, {$set: {marks: req.body.marks}}, {new: true, useFindAndModify: false}, (err, doc)=>{
        if (err) {
            console.log("update document error");
        } else {    
            console.log("update document success");
            console.log(doc);
        }
    })
})
app.listen(80, ()=>{
    console.log(`Server is running at ${hostname}:${port}/`);
});