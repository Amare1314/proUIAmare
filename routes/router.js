var router = require('express').Router();
var users = []; //记录那些已经注册过的用户信息

//用户对首页的访问
router.get('/', function (req, res, next) {
    res.render('login_full.html', { title: 'login' });
});

//处理注册请求
router.post('/register', function (req, res, next) {
    //获得用户输入的数据
    var userName = req.body.userName;
    var password = req.body.password;
    var qq = req.body.qq;

    //对数据进行处理
    var userObj = {
        userName: userName,
        password: password,
        qq: qq
    };

    //注册逻辑
    /*
    if(用户已经注册过了){
        返回：请更换注册名
    }else{
        真的进行注册
        返回到：首页去登录
    }
     */
    var userLocal = findUser(userObj);
    if (null === userLocal) {
        // 真的进行注册
        users.push(userObj); //注册用户放到数据集合中
        // 返回到：首页去登录
        res.redirect('/');//跳转到首页去
        console.log(users);
    } else {
        //返回：请更换注册名
        res.send('请更换注册名，重新注册');
    }
    //返回数据
});

//登录的逻辑
router.post('/login', function (req, res, next) {
    //获得数据
    var userName = req.body.userName;
    var password = req.body.password;

    //数据处理
    var userObj = {
        userName: userName,
        password: password
    };

    //登录的逻辑
    /*
     if(用户已经注册过了){
        登录成功
        返回一段话
     }else{
        返回：请先注册
     }
     */

    var userLocal = findUser(userObj);
    if (null !== userLocal) {
        //已经注册过了
        if (userLocal.password === password) {
            //用户名和密码都正确
            // res.send('正确登录');
            res.redirect('/service.html');
        } else {
            //返回一段话：密码不正确
            res.send('密码不正确');
        }
    } else {
        //返回：请先注册
        res.send('用户名不存在请先注册');
    }
    //返回
});

//是否已经注册过了
function findUser(userObj) {
    var result = null; //初始化
    for (var i = 0; i < users.length; i++) {
        var objTemp = users[i];
        if (objTemp.userName === userObj.userName) {
            //找到了已经注册过的用户
            result = objTemp;
            break;
        }
    }
    return result;
}


module.exports = router;