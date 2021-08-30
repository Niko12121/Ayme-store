const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
    key: "userId",
    secret: "realsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ayme_database',
});

app.post("/register", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)}
        const sqlInsert = "INSERT INTO Users (name, password) VALUES (?,?);";
        db.query(sqlInsert, [userName, hash], (error, result) => {
            if (error) {
                console.log(error)}
        })
    })
})


app.post("/login", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    const sqlInsert = "SELECT * FROM Users WHERE name = ?;";
    db.query(sqlInsert, userName, (err, result) => {
        if (err) {
            res.send({ err: err })
        }
        if (result.length > 0){
            bcrypt.compare(password, result[0].password, (error, response)=> {
                if (response) {
                    req.session.user = result;
                    res.send({ message: "Logged", user:userName })
                } else {
                    res.send({ message: "Wrong password" })
                }
            })
        } else {
            res.send({ message: "User doesn't exist" })
        }
    })
})

app.post("/product", (req, res) => {
    const productName = req.body.name;
    const productValue = req.body.value;
    const productDescription = req.body.description;
    const sqlInsert = "INSERT INTO Products (name, value, description) VALUES (?,?,?);";
        db.query(sqlInsert, [productName, productValue, productDescription], (error, result) => {
            if (error) {
                console.log(error)}
        })
})

app.get("/products/get", (req, res) => {
    const sqlSelect = "SELECT * FROM Products;"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get("/products/product/get", (req, res) => {
    const id = req.query.id
    const sqlSelect = "SELECT * FROM Products WHERE IdProduct = ?;";
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

app.get('/logout', (req,res) => {
    req.session.destroy(function (err) {
        res.send({ logout: true })
    });
})

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user[0] })
    } else {
        res.send({ loggedIn: false })
    }
})


app.listen(3001, () => {
    console.log("running in port 3001");
})