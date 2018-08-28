var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// exports.findUser = function (whereStr){
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var collection_user = db.db("proUIAmare").collection("user");
//         collection_user.find(whereStr).toArray(function (err, result) {
//             if (err) throw err;
//             console.log("result------------->" + result);
//             db.close();
//             return result;
//         });
//     });
// }