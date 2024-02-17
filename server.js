const express = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs');
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'GCS_User';
const COLLECTION_NAME = 'users';

const app = express();
const PORT = 3000;
// const DB_FILE = 'C:/Users/sajal/Downloads/LoginApp/LoginApp/users.json';



// if (!fs.existsSync(DB_FILE)) {
//     fs.writeFileSync(DB_FILE, '[]');
// }

// let users = JSON.parse(fs.readFileSync(DB_FILE));

app.use(bodyParser.json());

MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Authentication Route
    app.post('/authenticate', (req, res) => {
        const { username, password } = req.body;
        usersCollection.findOne({ username, password })
            .then(user => {
                if (user) {
                    res.json({ success: true });
                } else {
                    res.status(401).json({ success: false, message: "Authentication failed" });
                }
            })
            .catch(error => {
                console.error("Error authenticating user:", error);
                res.status(500).json({ success: false, message: "Server error" });
            });
    });

    // Registration Route
    app.post('/register', (req, res) => {
        const { username, password } = req.body;
        usersCollection.findOne({ username })
            .then(existingUser => {
                if (existingUser) {
                    res.status(400).json({ success: false, message: "Username already exists" });
                } else {
                    return usersCollection.insertOne({ username, password });
                }
            })
            .then(result => {
                res.json({ success: true, message: "Registration successful" });
            })
            .catch(error => {
                console.error("Error registering user:", error);
                res.status(500).json({ success: false, message: "Server error" });
            });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
});