
// Created by: Carlos Febrero
// Date: 11/10/2016

//Defining variables and connection values
var sql = require("seriate");
var app   = require('express')();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var properties = require('./properties.js');

// SQL Server and database settings
var config = {
    "server": properties.server,
    "user": properties.user,
    "password": properties.password,
    "database": properties.database
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET method, access API
app.get('/',function(req,res){
    var data = {
        "Data":""
    };
    data["Data"] = "Welcome to ROLO System logs...";
    res.jsjson(data);
});

//GET method, gets all the data from data base
app.get('/hotel',function(req,res){
    var data = {
        "error":1,
        "Logs":""
    };

    sql.setDefaultConfig( config );
    sql.execute( {
        query: "select * from tableName"
    } ).then( function( results ) {
        data["error"] = 0;
        data["Logs"] = results;
        res.json(data);
        console.log( results );
    }, function( err ) {
        console.log( "Something bad happened:", err );
        data["Logs"] = 'No Logs Found..';
        res.json(data);
    } );

});

//GET method, gets all the data from data base based on Office ID
app.get('/hotel/:id',function(req,res){
    var data = {
        "error":1,
        "Logs":""
    };
    var id = req.params.id
    sql.setDefaultConfig( config );
    sql.execute( {
        query: "select * from tableName where OfficeID = " + id
    } ).then( function( results ) {
        data["error"] = 0;
        data["Logs"] = results;
        res.json(data);
        console.log( results );
    }, function( err ) {
        console.log( "Something bad happened:", err );
        data["Logs"] = 'No Logs Found..';
        res.json(data);
    } );

});

//GET method, gets all the data from data base based on date sent
app.get('/hotel/date/:id',function(req,res){
    var data = {
        "error":1,
        "Logs":""
    };
    var id = req.params.id
    sql.setDefaultConfig( config );
    sql.execute( {
        query: "select * from tableName where CommandSentDate LIKE '" + id + "%'"
    } ).then( function( results ) {
        data["error"] = 0;
        data["Logs"] = results;
        res.json(data);
        console.log( results );
    }, function( err ) {
        console.log( "Something bad happened:", err );
        data["Logs"] = 'No Logs Found..';
        res.json(data);
    } );

});

//POST method, insert new value into data base
app.post('/hotel',function(req,res){
    var token = req.headers.token;
    var secretToken = properties.token;
    var _ = require('lodash'),
        sqlStmt = "INSERT INTO tableName (OfficeID, Agent, CommandSent, HostResponse, CommandSentDate, CommandReceivedDate)"+
            "Values( '${officeID}', '${agent}', '${commandSent}', '${hostResponse}', '${commandSentDate}', '${commandReceivedDate}')",
        object = {
            officeID: req.body.OfficeID,
            agent: req.body.Agent,
            commandSent : req.body.CommandSent,
            hostResponse : req.body.HostResponse,
            commandSentDate : req.body.CommandSentDate,
            commandReceivedDate : req.body.CommandReceivedDate

        }
    compiled = _.template(sqlStmt);
    console.log(compiled(object));
    var data = {
        "error":1,
        "Logs":""
    };

    if(token == secretToken){
        sql.setDefaultConfig( config );
        sql.execute( {
            query: compiled(object),
        } ).then( function( results ) {
            data["error"] = 0;
            data["Logs"] = 'Success!';
            res.json(data);
            console.log( results );
        }, function( err ) {
            console.log( "Something bad happened:", err );
            data["Logs"] = 'No Logs Found...';
            res.json(data);
        } );
    }else{
        data["error"] = 1;
        data["Logs"] = 'Refused...';
        res.json(data);
    }
});

http.listen(8081,function(){
    console.log("Connected & Listen to port 8080");
});


