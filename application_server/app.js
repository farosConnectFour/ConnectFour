/**
 * Created by peeteli on 4/09/2015.
 */

var express = require('express'),
    app = express(),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    cors = require('cors');

var clientDir = "../public";
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'connectFour'
});
var isConnectedIndex;

var connectedUsers = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session());
app.use(cors({origin: 'http://localhost:9999', credentials: true}));
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
            if(rows.length){
                foundPassword = rows[0].password;
            }
            if(foundPassword && foundPassword === password && !isConnected(rows[0].name)){
                return done(null, {username: rows[0].name, id: rows[0].userId})
            }
            return done(null, false)
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

app.get('/loggedin', function(req, res)
{
    res.send(req.isAuthenticated() ? '1' : '0');
});

app.post("/login", passport.authenticate('local'), function(req, res)
{
    connectedUsers.push(req.user.username);
    res.json(req.user);
});

app.post('/logout', function(req, res)
{
    if(req.user) {
        disconnectUser(req.user.username);
    }
    req.logOut();
    res.sendStatus(200);
});

app.listen(9999, function() {
    console.log("Listening on port 9999");
});



function isConnected(username){
    for(isConnectedIndex = 0; isConnectedIndex < connectedUsers.length; isConnectedIndex++){
        if(connectedUsers[isConnectedIndex] === username){
            return true;
        }
    }
    return false;
}

function disconnectUser(username){
    connectedUsers.splice(connectedUsers.indexOf(username), 1);
}