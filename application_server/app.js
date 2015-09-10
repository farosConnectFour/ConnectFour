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
    mysql = require('mysql'),
    cors = require('cors');

var clientDir = "../public";
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'connectFour'
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(cors({origin: 'http://10.1.15.94:9999', credentials: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(clientDir));
app.use(express.static(clientDir + "/app"));
app.use(express.static(clientDir + "/libs"));

passport.use(new LocalStrategy(
    function(username, password, done) {
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            database : 'connectFour'
        });
        var foundPassword = undefined;

        connection.connect();
        connection.query("select * from users where name = ?", username, function(err, rows){
            if(rows){
                foundPassword = rows[0].password;
            }
            if(foundPassword && foundPassword === password){
                return done(null, {username: rows[0].name, id: rows[0].userId})
            } else {
                return done(null, false)
            }
        });
        connection.end();


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
    res.json(req.user);
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.sendStatus(200);
});

app.listen(9999, function() {
    console.log("Listening on port 9999");
});