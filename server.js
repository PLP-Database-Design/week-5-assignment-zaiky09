const express = require('express')
const app = express()

// Load .env file
require('dotenv').config(); 
const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection to the database
db.connect((err) => {
    if (err) return console.log("Error connecting to MYSQL");
    console.log("Connected to MYSQL as id: ", db.threadId);
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// Question 3: Filter patients by first name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    if (!first_name) {
      return res.status(400).json({ error: 'First name is required' });
    }
  
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
// Question 4: Retrieve all providers by specialty
app.get('/providers/filter', (req, res) => {
    const { provider_specialty } = req.query;
    if (!provider_specialty) {
      return res.status(400).json({ error: 'Provider specialty is required' });
    }
  
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [provider_specialty], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  

// listen to the server

app.listen(process.env.PORT, () => {
  console.log(`server is runnig on http://localhost:${process.env.PORT}`)
});

// End points
// To get all patients: http://localhost:3300/patients
// To get all providers: http://localhost:3300/providers
// To filter patients: http://localhost:3300/patients/filter?first_name=John
// To filter providers: http://localhost:3300/providers/filter?provider_specialty=Cardiology