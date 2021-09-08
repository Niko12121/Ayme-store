const express = require('express');

const path = require('path');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/src/Images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Math.trunc(Date.now()/1000).toString() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits:{fieldSize: 1000000},
 })

 router = express.Router();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
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
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60 * 60 * 1000
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
    const productActualValue = req.body.actual_value
    const productDescription = req.body.description;
    const productFile = req.body.file;
    const sqlInsert = "INSERT INTO Products (name, value, actual_value, description, file) VALUES (?,?,?,?,?);";
        db.query(sqlInsert, [productName, productValue, productActualValue, productDescription, productFile], (error, result) => {
            if (error) {
                console.log(error)}
        })
})
app.post("/upload", upload.single('image'), (req, res) => {
    res.send("Image Uploaded")
})

app.post("/categories", (req, res) => {
    const categoryName = req.body.name;
    const categoryDescription = req.body.description;
    const sqlInsert = "INSERT INTO Categories (category, description) VALUES (?,?);"
    db.query(sqlInsert, [categoryName, categoryDescription], (error, result) => {
        if (error) {
            console.log(error)}
    })
})

app.post("/subcategories", (req, res) => {
    const subName = req.body.name;
    const category = req.body.category;
    const sqlInsert = "INSERT INTO Subcategories (name, category) VALUES (?,?);";
    db.query(sqlInsert, [subName, category], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

app.post("/product/subcategory", (req, res) => {
    const idProduct = req.body.idProduct;
    const category = req.body.category;
    const subcategory = req.body.subcategory;
    const sqlInsert = "INSERT INTO ProductSubcategories (idProduct, category, subcategory) VALUES (?,?,?);"
    db.query(sqlInsert, [idProduct, category, subcategory], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

/* Get categories and his subcats */

app.get("/categories/get", (req, res) => {
    const sqlSelect = "SELECT * FROM Categories;"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get("/category/subcategories", (req, res) => {
    const category = req.query.category;
    const sqlSelect = "SELECT * FROM Subcategories WHERE category = ?;";
    db.query(sqlSelect, category, (error, result) => {
        res.send(result)
    })
})

/* Get all products */

app.get("/products/get", (req, res) => {
    const sqlSelect = "SELECT * FROM Products;"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

/* Get info of 1 product */

app.get("/products/product/get", (req, res) => {
    const id = req.query.id
    const sqlSelect = "SELECT * FROM Products WHERE IdProduct = ?;";
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

/* Get categories and subcats of 1 products */

app.get("/product/categories/get", (req, res) => {
    const id = req.query.id;
    const sqlSelect = "SELECT category, subcategory FROM ProductSubcategories WHERE idProduct = ?;";
    db.query(sqlSelect, id, (err, result) => {
        res.send(result)
    })
})

app.get('/logout', (req,res) => {
    req.session.destroy(function (err) {
        res.send({ logout: true })
    });
})

/* Login */

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user[0] })
    } else {
        res.send({ loggedIn: false })
    }
})

/* Update product */

app.put("/api/product/update", (req, res) => {
    const id = req.body.idProduct;
    const newName = req.body.newName;
    const newValue = req.body.newValue;
    const newActualValue = req.body.newActualValue
    const newDescription = req.body.newDescription;
    const sqlUpdate = "UPDATE Products SET name = ?, value = ?, actual_value = ?, description = ? WHERE idProduct = ?;";
    db.query(sqlUpdate, [newName, newValue, newActualValue, newDescription, id], (err, result) => {
        if (err) {
            console.log(err)
        }
    })

})

app.delete("/api/product/delete/:idProduct", (req, res) => {
    const id = req.params.idProduct;
    const sqlDelete = "DELETE FROM Products WHERE idProduct = ?;";
    db.query(sqlDelete, id, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
    const sqlDeleteCat = "DELETE FROM ProductSubcategories WHERE idProduct = ?;"
    db.query(sqlDeleteCat, id, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
})

app.delete("/category/delete/:category", (req, res) => {
    const category = req.params.category;
    const sqlDelete = "DELETE FROM Categories WHERE category = ?;";
    db.query(sqlDelete, category, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
    const sqlDeleteSubs = "DELETE FROM Subcategories WHERE category = ?;";
    db.query(sqlDeleteSubs, category, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
    const sqlDeleteProd = "DELETE FROM ProductSubcategories WHERE category = ?;"
    db.query(sqlDeleteProd, category, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
})

app.delete("/product/subcategory", (req, res) => {
    const id = req.body.id;
    const category = req.body.category;
    const subcategory = req.body.subcategory;
    sqlDelete = "DELETE FROM ProductSubcategories WHERE idProduct = ? AND category = ? AND subcategory = ?;"
    db.query(sqlDelete, [id, category, subcategory], (err, result) => {
        if (err) {
            console.log(err)
        }
    })
})

app.delete("/subcategory/delete", (req, res) => {
    const subcategory = req.body.subcategory;
    const category = req.body.category;
    sqlDelete = "DELETE FROM Subcategories WHERE name = ? AND category = ?;"
    db.query(sqlDelete, [subcategory, category], (err, result) => {
        if (err) {
            console.log(err)
        }
    })
    sqlDeleteProd = "DELETE FROM ProductSubcategories WHERE category = ? AND subcategory = ?;"
    db.query(sqlDeleteProd, [category, subcategory], (err, result) => {
        if (err) {
            console.log(err)
        }
    })
})

app.listen(3001, () => {
    console.log("running in port 3001");
})