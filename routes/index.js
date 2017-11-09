var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var twilio = require('twilio');

const DB_USER = 'user';
const DB_PASSWORD = '1234';

const user = require('../lib/users');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@ds147274.mlab.com:47274/database092317');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  //cache profile information
  const username = req.body.username;
  const password = req.body.password;

  user.findOne({ username: username }, (err, userObj) => {
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    //if user is not found
    if(!userObj){
      return res.status(404).send();
    }
    // test a hash password
    userObj.comparePassword(password, function(err, isMatch) {
      if(isMatch && isMatch === true){
        //save the user in the session
        req.session.userObj = userObj;
        //if user is found
        return res.status(200).send(userObj);
      } else {
        return res.status(401).send();
      }
    });
  });
});

router.get('/dashboard', (req, res, next) => {
  //if not able to log in
  if(!req.session.userObj){
    return res.status(401).send();
  }
  //if able to log in
  return res.status(200).send('My dashboard');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  return res.status(200).send();
});

router.post('/register', (req, res, next) => {
  //cache profile information
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  //create in instance of the user schema
  let userProfile = new user();
  //set profile information
  userProfile.username = username;
  userProfile.password = password;
  userProfile.firstname = firstname;
  userProfile.lastname = lastname;
  //save profile information
  userProfile.save((err, userObj) => {
    //send status
    if(err){
      console.log(err);
      return res.status(500).send();
    } else {
      return res.status(200).send();
    }
  });
});

router.post('/email', (req, res, next) => {
  //cache email information
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const name = req.body.name;
  const to = 'ijh5005@outlook.com';

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'isaiahharrison1414@gmail.com',
      pass: 'ppppPPPP'
    }
  });

  var mailOptions = {
    from: email,
    to: 'ijh5005@outlook.com',
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send();
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send();
    }
  });
});

router.post('/text', (req, res, next) => {
  //store in environment variables
  const twilioSID = 'AC93d2af277ae58e64e46168894dcf38a1';
  const twilioAuth = '609fcb7194cd0923ad64d13e0f22107c';
  //cache email information
  const twilioNumber = '+12153525451';
  const userName = req.body.userName;
  const userNumber = req.body.userNumber;
  const userMessage = req.body.userMessage;

  // Find your account sid and auth token in your Twilio account Console.
  var client = new twilio(twilioSID, twilioAuth);

  // Send the text message.
  client.messages.create({
    to: userNumber,
    from: twilioNumber,
    body: userMessage
  });

  client.sendMessage();

  setTimeout(() => {
    res.status(200).send();
  }, 1000);

});

module.exports = router;
