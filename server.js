// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // replace with your MySQL username
    password: 'your_password', // replace with your MySQL password
    database: 'ResuWise'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle resume submission
app.post('/submit-resume', upload.single('profileImage'), (req, res) => {
    const {
        fullName,
        phone,
        email,
        address,
        school10,
        graduationDate10,
        school12,
        graduationDate12,
        degree,
        collegeName,
        graduationDateDegree,
        otherDegree,
        otherCollege,
        graduationDateOther,
        jobTitle,
        companyName,
        jobDuration,
        skills
    } = req.body;

    const profileImage = req.file ? req.file.path : null; // Get the path of the uploaded image

    // Insert user data into Users table
    const userQuery = 'INSERT INTO Users (full_name, email, phone, address, profile_image) VALUES (?, ?, ?, ?, ?)';
    db.query(userQuery, [fullName, email, phone, address, profileImage], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const userId = result.insertId; // Get the newly created user ID

        // Insert resume data into Resumes table
        const resumeQuery = 'INSERT INTO Resumes (user_id, school_10, graduation_date_10, school_12, graduation_date_12, degree, college_name, graduation_date_degree, other_degree, other_college, graduation_date_other, job_title, company_name, job_duration, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(resumeQuery, [userId, school10, graduationDate10, school12, graduationDate12, degree, collegeName, graduationDateDegree, otherDegree, otherCollege, graduationDateOther, jobTitle, companyName, jobDuration, skills], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Resume submitted successfully!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});