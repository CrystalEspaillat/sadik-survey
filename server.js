// DEPENDENCIES
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').load();
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const request = require('superagent');
const app = express();

// SERVE STATIC FILES
app.use('/public', express.static(path.join(__dirname, 'public')));

// DISPLAY PAGE
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/survey', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/pages/survey.html'));
});

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CLICK EVENT
app.post('/send', (req, res) => {

    //NODEMAILER
    smtpTransport = nodemailer.createTransport( {
        service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAILSENDS,
            pass: process.env.USERPASSWORD
        }
    });

    // Variables holding some form responses
   const firstName = `${req.body.firstname}`;
   const replyTo = `${req.body.email}`;
   const marketing = `${req.body.marketing}`;


    // create a body for the email
    const output = `
        <hr>
        <h1>Contact Details:</h1> 
        <p style="margin-left:10px;"><strong>Name:</strong> ${req.body.firstname} ${req.body.lastname}</p>
        <p style="margin-left:10px;"><strong>Email:</strong> ${req.body.email}</p>
        <p style="margin-left:10px;"><strong>Worked with online coach before?</strong> ${req.body.experience}</p>
        <p style="margin-left:10px;"><strong>Active Lifestyle Rating ?</strong> ${req.body.lifestyle}/100</p>
        <h1>Goals:</h1>
        <p style="margin-left:10px;">${req.body.goals}</p>
        <hr>
        <p> Please do NOT reply to this unmonitored email address. </p>
    `;

    // create email
    var mailOptions = {
        from: process.env.EMAILSENDS,
        to: process.env.EMAILGETS,
        replyTo: replyTo,
        subject: 'New Swipe-Up Inquiry from ' + firstName,
        text: 'You have a new client inquiry to review!',
        html: output
    }

    // send the mail
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });

    // ADD TO MAILCHIMP

    const mailchimpInstance = process.env.MAILCHIMPINST;
    const listUniqueId = process.env.MAILCHIMPLIST;
    const mailchimpApiKey = process.env.MAILCHIMPAPI;

    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
        'email_address': req.body.email,
        'status': 'subscribed',
        'merge_fields': {
            'FNAME': req.body.firstname,
            'LNAME': req.body.lastname
        }
        })
        .end(function(err, response) {
            if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
            console.log('Signed Up!');
            } else {
            console.log('Sign Up Failed :(');
            }
        });
});

// LISTEN
app.listen(process.env.PORT || 3000, () => console.log('Server started...'));