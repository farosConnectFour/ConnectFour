/**
 * Created by peeteli on 4/09/2015.
 */

var express = require('express'),
    app = express(),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    mysql = require('mysql');

var clientDir = "../public";
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'connectFour'
});

connection.connect();
connection.query("select * from users", function(err, rows){
    console.log(rows);
});
connection.end();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(clientDir));
app.use(express.static(clientDir + "/app"));
app.use(express.static(clientDir + "/libs"));

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username === password){
            return done(null, {username: username})
        } else {
            return done(null, false)
        }
    })
);

passport.serializeUser(function(user, done)
{
    done(null, user);
});

passport.deserializeUser(function(user, done)
{
    done(null, user);
});

app.post("/login", passport.authenticate('local'), function(req, res)
{
    var user = req.user;
    res.json(user);
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.send(200);
});

app.listen(9999, function() {
    console.log("Listening on port 9999");
});