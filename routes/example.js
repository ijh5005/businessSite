var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:1234@ds147274.mlab.com:47274/database092317');

const mySchema = mongoose.Schema({
  username: String,
  password: Number,
});

const userProfile = mongoose.model('profile', mySchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//sumbit user information
router.post('/userinfo', (req, res, next) => {
  let newProfile = new userProfile();
  const name = req.query.username;
  const password = req.query.password;

  newProfile.username = name;
  newProfile.password = password;

  newProfile.save((err, obj) => {
    if(err){
      console.log(err);
      res.status(500).send();
    } else {
      res.send(obj);
    }
  });
});

//get user information
router.get('/userinfo', (req, res, next) => {
  userProfile.find({}, (err, obj) => {
    if(err){
      console.log(err);
      res.status(500).send();
    } else {
      res.send(obj);
    }
  });
});

//update the user information
router.put('/update', (req, res, next) => {
  const name = req.query.username;
  const password = req.query.password;
  const id = req.query.id;

  userProfile.findOne({_id: id}, (err, obj) => {
    //update the information if the information is given in the url
    if(name){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        obj.username = name;
        obj.save((err, object) => {
          if(err){
            console.log(err);
            res.status(500).send();
          } else {
            res.send(object);
          }
        });
      }
    }

    if(password){
      if(err){
        console.log(err);
        res.status(500).send();
      } else {
        obj.password = password;
        obj.save((err, object) => {
          if(err){
            console.log(err);
            res.status(500).send();
          } else {
            res.send(object);
          }
        });
      }
    }

  }); // end: userProfile.findOne

});

router.delete('/deleteaccount', (req, res, next) => {
  const id = req.query.id;
  userProfile.findOneAndRemove({_id: id}, (err) => {
    if(err){
      console.log(err);
      return res.status(500).send();
    }

    return res.status(200).send();
    
  });
});

module.exports = router;
