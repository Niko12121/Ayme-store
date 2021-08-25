const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ayme_database',
});

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/get", (req, res) => {
    const sqlSelect = 
        "SELECT * FROM Users";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.post("/api/insert", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    const sqlInsert = "INSERT INTO Users (name, password) VALUES (?,?);";
    db.query(sqlInsert, [userName, password], (err, result) => {})
})

app.listen(3001, () => {
    console.log("running in port 3001");
})