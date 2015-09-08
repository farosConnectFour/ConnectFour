/**
 * Created by peeteli on 4/09/2015.
 */

var express = require('express');
var app = express();

var clientDir = "../public";

app.use(express.static(clientDir));
app.use(express.static(clientDir + "/app"));
app.use(express.static(clientDir + "/libs"));

app.listen(9999, function() {
    console.log("Listening on port 9999");
});