var express = require('express');
var router = express.Router();
var dbHandle = require('../database/dbHandle');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  var username = req.body.login_username;
  var password = req.body.login_password;
  
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var whereStr = { "username": username, "password": password };  // 查询条件
    var collection_user = db.db("proUIAmare").collection("user");
    collection_user.find(whereStr).toArray(function (err, result) {
      if (err) throw err;
      if(result.length > 0){
        res.redirect('/index.html');
      } else {
        res.redirect('/login_full.html');
      }
      db.close();
    });
  });
  
});

router.post('/register', function (req, res, next) {
  var username = req.body.register_username;
  var email = req.body.register_email;
  var password = req.body.register_password;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var whereStr = { "username": username };  // 查询条件
    var collection_user = db.db("proUIAmare").collection("user");
    collection_user.find(whereStr).toArray(function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.redirect('/login_full.html#register');
      } else {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var newUser = { username: username, email: email, password: password };
          var collection_user = db.db("proUIAmare").collection("user");
          collection_user.insertOne(newUser, function (err, res) {
            if (err) throw err;
            console.log("用户插入成功");
            db.close();
          });
        });
        res.redirect('/login_full.html');
      }
      db.close();
    });
  });
});

router.post('/reminder', function (req, res, next) {
  var email = req.body.reminder_email;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var whereStr = { email: email };  // 查询条件
    var updateStr = { $set: { password: "123456" } };
    var collection_user = db.db("proUIAmare").collection("user");
    collection_user.updateOne(whereStr, updateStr, function (err, res) {
      if (err) throw err;
      console.log("密码重置成功");
      db.close();
    });
  });
  res.redirect('/login_full.html');
});

module.exports = router;
 