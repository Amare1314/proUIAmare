var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({ username: String, password: String, email: String });
var User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/loginVerify', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var whereStr = { "username": username, "password": password };  // 查询条件

  mongoose.connect(global.dbconnect);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, '连接失败'));
  db.once("open", function () {
    User.find(whereStr, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.json({ success: 1 , data: "登录成功"});//请求成功,验证成功
      } else {
        res.json({ success: 2, data: "用户名不存在,或者密码错误"});//请求成功,验证失败
        // res.redirect('/login_full.html');
        // res.redirect('/login_full.html');
      }
    });
  });

});

router.post('/login', function (req, res, next) {
  res.redirect('/index.html');
});

router.post('/register', function (req, res, next) {
  var username = req.body.register_username;
  var email = req.body.register_email;
  var password = req.body.register_password;

  mongoose.connect(global.dbconnect);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, '连接失败'));
  db.once("open", function () {
    var whereStr = { "username": username };  // 查询条件
    User.find(whereStr, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        res.redirect('/login_full.html#register');
      } else {
        var user = new User({ username: username, email: email, password: password });
        user.save(function(err, user){
          if (err) return console.error(err);
        });
        res.redirect('/login_full.html');
      }
    });
  });
});

router.post('/reminder', function (req, res, next) {
  var email = req.body.reminder_email;
  
  mongoose.connect(global.dbconnect);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, '连接失败'));
  db.once("open", function () {
    var whereStr = { email: email };  // 查询条件
    var updateStr = { $set: { password: "123456" } };
    User.updateOne(whereStr, updateStr, function (err, raw) {
      if (err) return handleError(err);
      console.log("密码重置成功");
      console.log('The raw response from Mongo was ', raw);
    });
  });
  res.redirect('/login_full.html');
});

module.exports = router;
 