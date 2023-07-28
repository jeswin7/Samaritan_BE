const express = require('express')
const app = express()
const port = 3001


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ESTABLISHING DB CONNECTION
const mysql = require('mysql')

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected')
})

// Create DB API call

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send('db created...')
  })
})


const SERVICE_MAP = {
  1: 'Accommodation',
  2: 'Part-Time Job'
}


// ______________REST OF THE ROUTES______________

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  let sql = 'SELECT * FROM USER'
  db.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item) => {
      console.log(item);
    });

    res.send(result)
  })
})


// Login API
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
    let role = "";
    let userId = null;
    result.forEach((item) => {
      if (item.email === email && item.pwd === password) {
        userValid = true;
        role = item.role;
        userId = item.user_id
      }
    });

    const response = {
      status: userValid ? 200 : 400,
      role,
      userId
    };

    res.status(response.status).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// --------------------------------------------------------------


// MENTOR APIs

// get all mentors
app.get('/mentors', (req, res) => {
  let sql = 'SELECT * FROM MENTOR'
  db.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item, index) => {
      console.log(index, '-', item)
    })

    res.send(result)
  })
})

// get single mentor based on id
app.get('/mentorDetail', (req, res) => {
  let {
    user_id
  } = req.query
  let sql = 'SELECT * FROM MENTOR WHERE `id`=' + user_id;

  db.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item, index) => {
      console.log(index, '-', item)
    })

    res.send(result)
  })
})

// Filter mentors API
app.get('', async (req, res) => {


  db.query(sql, (err, result) => {
    if (err) throw (err);

    res.send(result);
  })
})

app.get('/mentors/filter', async (req, res) => {
  let {
    filterName,
    filterValue
  } = req.query;

  try {
    const result = await new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM MENTOR WHERE ' + filterName + '=' + filterValue;
      db.query(sql, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// get all connection requests send to a specific mentor(based on id)
app.get('/mentor/connectionRequests', (req, res) => {
  let {
    user_id
  } = req.query
  let sql = 'SELECT * FROM CONNECTION WHERE `mentorId`=' + user_id;

  db.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item, index) => {
      console.log(index, '-', item)
    })

    res.send(result)
  })
})

// Mentor filter API
app.get('/mentors/filter', (req, res) => {
  let {
    filterName,
    filterValue
  } = req.query;

  let sql = "SELECT * FROM MENTOR WHERE " + filterName + "=" + filterValue;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
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

  let sql = "INSERT INTO MENTOR (fname, lname, num, email) VALUES ('" + firstName + "' ,'" + lastName + "' ,'" + contactNumber + "' ,'" + email + "')";
  db.query(sql, (err, result) => {
    if (err) throw new Error("oops something happened");
    console.log("mentor record inserted");
    result.send("mentor record inserted")
  });
})



// Update connection by mentor - accept/decline
app.get('/updateConnection', (req, res) => {
  console.log('add conn triggered')
  const {
    id,
    status
  } = req.query;

  let sql = "UPDATE CONNECTION SET `status`='" + status + "' WHERE id=" + id;

  db.query(sql, (err, result) => {
    if (err) throw (err);
    console.log('connection updated');
    res.send(result)
  })
})


// --------------------------------------------------------------




// SEEKER APIs


// get all seekers
app.get('/seekers', (req, res) => {
  let sql = 'SELECT * FROM SEEKER'
  db.query(sql, (err, result) => {
    if (err) throw (err);
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
  let user_sql = "INSERT INTO USER (email, pwd) VALUES ('" + email + "' ,'" + password + "')";
  let seeker_sql = "INSERT INTO SEEKER (fname, lname, num, address, location) VALUES ('" + firstName + "' ,'" + lastName + "' ,'" + contactNumber + "' ,'" + address + "' ,'" + location + "')";

  db.query(user_sql, (err, result) => {
    if (err) throw err;
    console.log("user record inserted");
  });

  db.query(seeker_sql, (err, result) => {
    if (err) throw err;
    console.log("seeker record inserted");
  });
})


// Add connection
app.post('/addConnection', (req, res) => {
  console.log('add conn triggered');
  const { seekerId, mentorId, serviceId } = req.body;

  // Get Seeker data
  let seekerName = ""; // Declare as a let variable to allow updating its value
  let sub_sql = `SELECT * FROM SEEKER WHERE id=${seekerId}`;
  db.query(sub_sql, (err, result) => {
    if (err) throw err;
    else {
      seekerName = result[0].fname + " " + result[0].lname; // Update the value of seekerName
      let sql = `INSERT INTO CONNECTION (seekerId, mentorId, serviceId, status, seekerName) VALUES (${seekerId}, ${mentorId}, ${serviceId}, 'PENDING', '${seekerName}')`;
      console.log(sql);

      db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('connection inserted');
        res.send(result);
      });
    }
  });
});





// get all connection requests send by a specific seeker(based on id)
app.get('/seeker/connectionRequests', (req, res) => {
  let { user_id } = req.query;
  let sql = 'SELECT * FROM CONNECTION WHERE `seekerId`=' + user_id;

  db.query(sql, (err, result) => {
    if (err) throw err;

    let promiseArray = result.map((item) => {
      let sub_sql = 'SELECT * FROM MENTOR WHERE `id`=' + item.mentorId;

      return new Promise((resolve, reject) => {
        db.query(sub_sql, (err, mentorResult) => {
          if (err) reject(err);

          let tempResponse = {
            connection: item,
            mentor: mentorResult,
          };

          resolve(tempResponse);
        });
      });
    });

    Promise.all(promiseArray)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  });
});


// --------------------------------------------------------------


// Shared APIs - APIs that all 3 user roles would be using

// Get all connections
app.get('/connections', (req, res) => {
  console.log('get all connections triggered')

  let sql = "SELECT * FROM CONNECTION"

  db.query(sql, (err, result) => {
    if (err) throw (err);
    res.send(result);
  })
})



// --------------------------------------------------------------




// ADMIN APIs

// get all seekers
app.get('/admin/dashboard', (req, res) => {
  let api = {};
  let service = {};
  let mentorsStatus = {}

  let sql = 'SELECT COUNT(*) AS seekerCount FROM SEEKER'
  db.query(sql, (err, result) => {
    if (err) throw (err);
    api = { ...result[0] }
  })

  let sql2 = 'SELECT COUNT(*) AS mentorCount FROM MENTOR'
  db.query(sql2, (err, result) => {
    if (err) throw (err);
    api = { ...api, ...result[0] }
  })

  let sql3 = 'SELECT COUNT(*) AS ongoing FROM SERVICE WHERE status="PENDING"'
  db.query(sql3, (err, result) => {
    if (err) throw (err);
    service = { ...service, ...result[0] }

  })

  let sql4 = 'SELECT COUNT(*) AS failed FROM SERVICE WHERE status="FAILED"'
  db.query(sql4, (err, result) => {
    if (err) throw (err);
    service = { ...service, ...result[0] }


  })

  let sql5 = 'SELECT COUNT(*) AS completed FROM SERVICE WHERE status="COMPLETED"'
  db.query(sql5, (err, result) => {
    if (err) throw (err);
    service = { ...service, ...result[0] }
  })


  // Mentor's status data
  let sql6 = 'SELECT COUNT(*) AS applied FROM MENTOR WHERE onboardStatus="APPLIED"'
  db.query(sql6, (err, result) => {
    if (err) throw (err);
    mentorsStatus = { ...mentorsStatus, ...result[0] }
  })

  let sql7 = 'SELECT COUNT(*) AS invited FROM MENTOR WHERE onboardStatus="INVITED"'
  db.query(sql7, (err, result) => {
    if (err) throw (err);
    mentorsStatus = { ...mentorsStatus, ...result[0] }
  })

  let sql8 = 'SELECT COUNT(*) AS approved FROM MENTOR WHERE onboardStatus="APPROVED"'
  db.query(sql8, (err, result) => {
    if (err) throw (err);
    mentorsStatus = { ...mentorsStatus, ...result[0] }

    res.send({...api, service, mentorsStatus})
  })

})


// Services API for admin console
app.get('/admin/viewServices', (req, res) => {
  let api = [];

  let sql = 'SELECT * FROM SERVICE';
  db.query(sql, (err, result) => {
    if (err) throw err;

    // Function to fetch seeker data using seekerId
    const fetchSeekerData = (seekerId) => {
      return new Promise((resolve, reject) => {
        let seekerSql = 'SELECT * FROM SEEKER WHERE id = ?';
        db.query(seekerSql, [seekerId], (seekerErr, seekerResult) => {
          if (seekerErr) reject(seekerErr); // Handle seekerErr using reject
          resolve(seekerResult[0]);
        });
      });
    };

    // Function to fetch mentor data using mentorId
    const fetchMentorData = (mentorId) => {
      return new Promise((resolve, reject) => {
        let mentorSql = 'SELECT * FROM MENTOR WHERE id = ?';
        db.query(mentorSql, [mentorId], (mentorErr, mentorResult) => {
          if (mentorErr) reject(mentorErr); // Handle mentorErr using reject
          resolve(mentorResult[0]);
        });
      });
    };

    // Fetch data for each service in the result
    Promise.all(
      result.map(async (item) => {
        const subApi = {};

        try {
          // Fetch individual seeker data using seekerId
          subApi.seeker = await fetchSeekerData(item.seekerId);

          // Fetch individual mentor data using mentorId
          subApi.mentor = await fetchMentorData(item.mentorId);

          // Add other service data to subApi object
          subApi.type = SERVICE_MAP[item.type];
          subApi.status = item.status;

          // Add the subApi object to the api array
          api.push(subApi);
        } catch (error) {
          console.error(error); // Handle any errors that occurred during the fetch
        }
      })
    )
      .then(() => {
        res.send(api);
      })
      .catch((error) => {
        console.error(error); // Handle any errors that occurred during the Promise.all
      });
  });
});


// Get all payments for dmin
app.get('/admin/viewPayments', (req, res) => {
  let api = []
  let sql = "SELECT * FROM PAYMENT";

  db.query(sql, (err, result) => {
    if (err) throw (err);

    // Function to fetch service data using serviceId
    const fetchServiceData = (serviceId) => {
      return new Promise((resolve, reject) => {
        let serviceSql = 'SELECT * FROM SERVICE WHERE id = ?';
        db.query(serviceSql, [serviceId], (serviceErr, serviceResult) => {
          if (serviceErr) reject(serviceErr); // Handle seekerErr using reject
          resolve(serviceResult[0]);
        });
      });
    };

    // Function to fetch seeker data using seekerId
    const fetchSeekerData = (seekerId) => {
      return new Promise((resolve, reject) => {
        let seekerSql = 'SELECT * FROM SEEKER WHERE id = ?';
        db.query(seekerSql, [seekerId], (seekerErr, seekerResult) => {
          if (seekerErr) reject(seekerErr); // Handle seekerErr using reject
          resolve(seekerResult[0]);
        });
      });
    };

    // Function to fetch mentor data using mentorId
    const fetchMentorData = (mentorId) => {
      return new Promise((resolve, reject) => {
        let mentorSql = 'SELECT * FROM MENTOR WHERE id = ?';
        db.query(mentorSql, [mentorId], (mentorErr, mentorResult) => {
          if (mentorErr) reject(mentorErr); // Handle mentorErr using reject
          resolve(mentorResult[0]);
        });
      });
    };


    // Fetch data for each service in the result
    Promise.all(
      result.map(async (item) => {
        const subApi = {};

        try {
          // Fetch individual service data using serviceId
          subApi.service = await fetchServiceData(item.serviceId);


          // Fetch individual seeker data using seekerId
          subApi.seeker = await fetchSeekerData(subApi.service.seekerId);

          // Fetch individual mentor data using mentorId
          subApi.mentor = await fetchMentorData(subApi.service.mentorId);


          // Add other service data to subApi object
          subApi.type = SERVICE_MAP[subApi.service.type ];
          subApi.status = item.status;

          // Add the subApi object to the api array
          api.push(subApi);
        } catch (error) {
          console.error(error); // Handle any errors that occurred during the fetch
        }
      })
    )
      .then(() => {
        res.send(api);
      })
      .catch((error) => {
        console.error(error); // Handle any errors that occurred during the Promise.all
      });
  })
})


// Update payment status by admin - PENDING/COMPLETED
app.get('/admin/updatePayment', (req, res) => {

  const {
    id,
    status
  } = req.query;

  let sql = "UPDATE PAYMENT SET status ='" + status + "' WHERE id=" + id;

  db.query(sql, (err, result) => {
    if (err) throw (err);
    console.log('payment updated');
    res.send(result)
  })
})


// Update mentor onboard status by admin - APPLIED/INVITED/APPROVED
app.get('/admin/mentorOnboardStatus/update', (req, res) => {

  const {
    id,
    status
  } = req.query;

  let sql = "UPDATE MENTOR SET onboardStatus ='" + status + "' WHERE id=" + id;

  db.query(sql, (err, result) => {
    if (err) throw (err);
    console.log('mentor onboard status updated');
    res.send(result)
  })
})




// Connections API for admin console
app.get('/admin/viewConnections', (req, res) => {
  let api = [];

  let sql = 'SELECT * FROM CONNECTION';
  db.query(sql, (err, result) => {
    if (err) throw err;

    // Function to fetch seeker data using seekerId
    const fetchSeekerData = (seekerId) => {
      return new Promise((resolve, reject) => {
        let seekerSql = 'SELECT * FROM SEEKER WHERE id = ?';
        db.query(seekerSql, [seekerId], (seekerErr, seekerResult) => {
          if (seekerErr) reject(seekerErr); // Handle seekerErr using reject
          resolve(seekerResult[0]);
        });
      });
    };

    // Function to fetch mentor data using mentorId
    const fetchMentorData = (mentorId) => {
      return new Promise((resolve, reject) => {
        let mentorSql = 'SELECT * FROM MENTOR WHERE id = ?';
        db.query(mentorSql, [mentorId], (mentorErr, mentorResult) => {
          if (mentorErr) reject(mentorErr); // Handle mentorErr using reject
          resolve(mentorResult[0]);
        });
      });
    };

    // Fetch data for each service in the result
    Promise.all(
      result.map(async (item) => {
        const subApi = {};

        try {
          // Fetch individual seeker data using seekerId
          subApi.seeker = await fetchSeekerData(item.seekerId);

          // Fetch individual mentor data using mentorId
          subApi.mentor = await fetchMentorData(item.mentorId);

          // Add other service data to subApi object
          subApi.type = SERVICE_MAP[item.service];
          subApi.status = item.status;

          // Add the subApi object to the api array
          api.push(subApi);
        } catch (error) {
          console.error(error); // Handle any errors that occurred during the fetch
        }
      })
    )
      .then(() => {
        res.send(api);
      })
      .catch((error) => {
        console.error(error); // Handle any errors that occurred during the Promise.all
      });
  });
});

// --------------------------------------------------------------


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
