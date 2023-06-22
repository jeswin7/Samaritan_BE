const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const express = require("express");

const mysql = require("mysql");


// Create connection

const db = mysql.createConnection({

  host: "localhost",

  user: "root",

  password: "simplilearn",

  database: "nodemysql",

});


// Connect to MySQL

db.connect((err) => {

  if (err) {

    throw err;

  }

  console.log("MySql Connected");

});


// Create DB

app.get("/createdb", (req, res) => {

  let sql = "CREATE DATABASE nodemysql";

  db.query(sql, (err) => {

    if (err) {

      throw err;

    }

    res.send("Database created");

  });

});