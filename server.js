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

      result.forEach((item) => {
        console.log(item);
      });

      res.send(result)
    })
  })


// get all mentors
  app.get('/mentors', (req, res) => {
    let sql = 'SELECT * FROM MENTOR'
    db.query(sql, (err, result) => {
      if(err) throw err;

      result.forEach((item, index) =>{
          console.log(index, '-', item)
      })

      res.send(result)
    })
  })


  // get all seekers
  app.get('/seekers', (req, res) => {
    let sql = 'SELECT * FROM SEEKER'
    db.query(sql, (err, result) => {
      if(err) throw(err);
      res.send(result);
    })
  })



  // Add Seeker API
  app.post('/addseeker', (req, res) => {
    console.log('trigger seeker add API', req.body)
    const {
      firstName,
      lastName,
      contactNumber,
      address,
      location,
      email,
      password,
  } = req.body;

  // SQL queries
    let user_sql = "INSERT INTO USER (email, pwd) VALUES ('"+email+"' ,'"+password+"')";
    let seeker_sql = "INSERT INTO SEEKER (fname, lname, num, address, location) VALUES ('"+firstName+"' ,'"+lastName+"' ,'"+contactNumber+"' ,'"+address+"' ,'"+location+"')";
    
    db.query(user_sql, (err, result) => {
      if (err) throw err;
      console.log("user record inserted");
    });

    db.query(seeker_sql, (err, result) => {
      if (err) throw err;
      console.log("seeker record inserted");
    });
  })



    // Add Mentor API
    app.post('/addmentor', (req, res) => {
      console.log('trigger mentor add API', req.body)

      const {
        firstName,
        lastName,
        contactNumber,
        email
    } = req.body;

      let sql = "INSERT INTO MENTOR (fname, lname, num, email) VALUES ('"+firstName+"' ,'"+lastName+"' ,'"+contactNumber+"' ,'"+email+"')";
      db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("mentor record inserted");
      });
    })




  app.get('/login', async (req, res) => {
    const { email, password } = req.query;
  
    try {
      const result = await new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM USER';
        db.query(sql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
  
      let userValid = false;
      result.forEach((item) => {
        if (item.email === email && item.pwd === password)
          userValid = true;
      });
  
      const response = {
        status: userValid ? 200 : 400
      };
  
      res.status(response.status).json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})