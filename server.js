// Created by Andres Morales
// Main Server App Control

console.log("MateLions socket server is running...");

var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');



var socket = require('socket.io');



var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
var io = socket(server);
io.sockets.on('connection', newConnection);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/mateLions-db");

var nameSchema = new mongoose.Schema({
  name: String,
  school: String
});
var User = mongoose.model("User", nameSchema);
app.use(express.static('public'));


app.get('/test', function(req, res) {
  res.render('test', {qs: req.query});
});

app.get('/request', function(req, res) {
  console.log(req.query);

});

function newConnection(socket){
  console.log("new connection: " +socket.id);

}

app.post("/addname", (req, res) => {
  var myData = new User(req);
  myData.save()
  .then(item => {
    res.send("item saved to database");
    //res.redirect('/test');
    console.log(req.body.firstName);

  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });
});


app.get('/get-data', function(req, res, next) {
 User.find({},{}, function(err, docs){
   res.render('data', {
     "users": docs
   });
 });
});
