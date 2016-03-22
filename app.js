var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');

var router = express.Router();

function make_connection(){
  return  mysql.createConnection({
            host     : '127.0.0.1',
            port     : '3306',
            user     : 'root',
            password : '',
            database : 'rest_server_test'
          });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({error: false, message: "Welcome to Rest Server!"});
});

// REST GET
router.get('/books', function( req, res, next ){  
  var connection = make_connection();
  connection.connect();

  var q = 'SELECT * FROM books';

  //if( req.query.length ){
    //filterable parameters
    var fields = ['name', 'type', 'author', 'year'];
    var where = [];
    fields.forEach( function( filter ){
      if( req.query.hasOwnProperty( filter ) ){
        where.push( filter+' LIKE('+connection.escape( '%'+req.query[filter]+'%' )+')' );
      }
    });

    if( where.length ){
      q+= ' WHERE '+where.join(' AND ');  
    }    
    console.log( q );
  //}

  connection.query( q , function(err, rows, fields) {
    if (err) throw err;

    res.json( rows );
  });

  connection.end();
});

// REST POST
router.post('/books', function( req, res, next ){
  var connection = make_connection();
  connection.connect();

  //var book = connection.escape( req.body.name );
  var fields = ['name', 'author', 'type', 'year'];
  var field_query = [];
  fields.forEach( function( field ){
    field_query.push( field+'='+connection.escape( req.body[ field ] ) );
  });

  var q = 'INSERT INTO books SET '+field_query.join(', ');
  //console.log( q );
  connection.query( q , function( err, result ) {
    if (err) return false;

    res.json( {error: false, message: "Data added.", insertid: result.insertId });
  });

  connection.end();
});

//REST GET
router.get('/books/:id', function( req, res, next ){
  var connection = make_connection();
  connection.connect();

  var id = connection.escape( req.params.id );

  //public properties
  var fields = ['name', 'type', 'author', 'year'];

  connection.query('SELECT '+fields.join(',')+' FROM books WHERE id='+id, function( err, result, fields ) {
    if (err) return false;

    if( !result.length ){
      res.json({error: true, message: "Unknown id:"+id });
    } else {
      res.json( {error: false, message: result });
    }
  });

  connection.end();
});

// REST PUT
router.put('/books/:id', function( req, res, next ){
  var connection = make_connection();
  connection.connect();

  var id = connection.escape( req.params.id );

  //updatable fields; Type field is intentionally left :)
  var fields = ['name', 'author', 'year'];

  connection.query('SELECT '+fields.join(',')+' FROM books WHERE id='+id, function( err, result ) {
    if (err){
      res.json({error: true, message: "Unknown id:"+id });
    } else {
      //console.log( result[0] );
      //connection.end();

      var setFields = [];
      fields.forEach( function( field ){
        if( req.body[ field ] ){
          setFields.push( field+'='+connection.escape( req.body[ field ] ) );
        }
      });
      if( setFields.length ){
        var q = 'UPDATE books SET '+setFields.join(', ')+' WHERE id='+id;
        //console.log( q );

        connection.query( q, function( err, result, fields ){
          if (err){
            res.json({error: true, message: 'Could not update database!' });
          } else {
            res.json( {error: false, message: 'Book updated.' });  
          }   

          connection.end();      
        });

      } else {
        res.json( {error: false, message: 'Nothing to update.' });

        connection.end();
      } 
    }           
  });

  //connection.end();
});

// REST DELETE
router.delete('/books/:id', function( req, res, next ){
  var connection = make_connection();
  connection.connect();

  var id = connection.escape( req.params.id );
  
  connection.query('DELETE FROM books WHERE id='+id, function( err, result ) {
    if (err){
      res.json({error: true, message: 'Could not delete from database!' });
    } else {
      res.json( {error: false, message: 'Book deleted.' });  
    }   

    connection.end(); 
  });
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router );

module.exports = app;