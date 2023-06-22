const express = require('express')
const app = express()
const port = 3001


app.use(express.json())
app.use(express.urlencoded({extended:true}))

// ESTABLISHING DB CONNECTION
const mysql = require('mysql')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('MySQL connected')
})

// Create DB API call

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send('db created...')
  })
})

// Create DB table API Call





// ______________REST OF THE ROUTES______________

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM USER'
    db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result)
      res.send(result)
    })
  })


  app.post('/adduser', (req, res) => {
    console.log('triggereeeeeddddd', req.body)
    let sql = "INSERT INTO USER (email, pwd) VALUES ('"+req.body.email+"' ,'"+req.body.pwd+"')";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})