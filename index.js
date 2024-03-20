const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL username
    password: '', // Change to your MySQL password
    database: 'test'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', (req, res) => {
    const { fname, lname, email, contact, password } = req.body;
    
    // Check if the user already exists
    const SELECT_USER_QUERY = `SELECT * FROM logu WHERE email = ?`;
    db.query(SELECT_USER_QUERY, [email], (err, result) => {
        if (err) {
            throw err;
        }
        
        //  // If the user already exists, send a response indicating that the user is already registered
        if (result.length > 0) {
            return res.status(409).send(`
                <h1>User Already Registered</h1>
                <p>The email address ${email} is already associated with an existing account.</p>
                <p>If you have forgotten your password, you can <a href="/reset-password">reset your password</a>.</p>
            `);
        }
        // If the user does not exist, proceed with registration
        const INSERT_USER_QUERY = `INSERT INTO logu (fname, lname, email, contact, password) VALUES (?, ?, ?, ?, ?)`;
        db.query(INSERT_USER_QUERY, [fname, lname, email, contact, password], (err, result) => {
            if (err) {
                throw err;
            }
            // Send a success message indicating successful registration
            res.status(200).send(`
                <h1>Registration Successful</h1>
                <p>Your account has been successfully registered.</p>
                <p>You can now <a href="/login">login</a> to your account.</p>
            `);
            // res.sendFile(__dirname + '/views/register.html');
        });
    });
});

app.get('/login', (req, res) => {
    // Serve login page for GET request
    res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM logu WHERE email = ?`;
    db.query(SELECT_USER_QUERY, [email], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // User is found, check password
            if (result[0].password === password) {
                res.sendFile(__dirname + '/views/home.html');
            } else {
                // Incorrect password
                res.status(401).send('Invalid email or password');
            }
        } else {
            // User not found
            res.status(404).sendFile(__dirname + '/404.html');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
