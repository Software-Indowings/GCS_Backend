// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = 3000;

// // const fs = require('fs');
// // const DB_FILE = 'C:/Users/sajal/Downloads/LoginApp/LoginApp/users.json';
// // if (!fs.existsSync(DB_FILE)) {
// //     fs.writeFileSync(DB_FILE, '[]');
// // }
// // let users = JSON.parse(fs.readFileSync(DB_FILE));


// const { MongoClient } = require('mongodb');
// const MONGODB_URI = 'mongodb://localhost:27017';
// const DB_NAME = 'GCS_User';
// const COLLECTION_NAME = 'users';



// app.use(bodyParser.json());

// MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(client => {
//     const db = client.db(DB_NAME);
//     const usersCollection = db.collection(COLLECTION_NAME);


//     app.get("/", (req, res)=>{
//         res.send('Welcome to my server.');       
//     });

//     // Authentication Route
//     app.post('/authenticate', (req, res) => {
//         const { username, password } = req.body;
//         usersCollection.findOne({ username, password })
//             .then(user => {
//                 if (user) {
//                     res.json({ success: true });
//                 } else {
//                     res.status(401).json({ success: false, message: "Authentication failed" });
//                 }
//             })
//             .catch(error => {
//                 console.error("Error authenticating user:", error);
//                 res.status(500).json({ success: false, message: "Server error" });
//             });
//     });

//     // Registration Route
//     app.post('/register', (req, res) => {
//         const { username, password } = req.body;
//         usersCollection.findOne({ username })
//             .then(existingUser => {
//                 if (existingUser) {
//                     res.status(400).json({ success: false, message: "Username already exists" });
//                 } else {
//                     return usersCollection.insertOne({ username, password });
//                 }
//             })
//             .then(result => {
//                 res.json({ success: true, message: "Registration successful" });
//             })
//             .catch(error => {
//                 console.error("Error registering user:", error);
//                 res.status(500).json({ success: false, message: "Server error" });
//             });
//     });

//     // Start the server
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// })
// .catch(error => {
//     console.error("Error connecting to MongoDB:", error);
// });

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'ls-46ce940f565a91f40aaeae2748a577cfa7a3f234.cx8km2ky23qf.ap-south-1.rds.amazonaws.com',
  user: 'dbmasteruser',
  password: 'IndoWings',
  database: 'GCS_Users'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

app.get("/", (req, res) => {
  res.send('Welcome to my server.');
});

// Authentication Route
app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    } else {
      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: "Authentication failed" });
      }
    }
  });
});

// Registration Route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    } else {
      res.json({ success: true, message: "Registration successful" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
