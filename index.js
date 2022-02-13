require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const app = express();

//ovo nema veze sa ubacivanjem slikama ovo je samo da se vidi da li moze da se poveze baza sa drugim ruterom
const mongojs = require('mongojs');
const db = mongojs('vezba', ['users', 'area', 'questions']);

let gfs;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

app.use("/file", upload);

//ovo nema veze sa ubacivanjem slikama ovo je samo da se vidi da li moze da se poveze baza sa drugim ruterom
app.use(express.json());

//ovo nema veze sa ubacivanjem slikama ovo je samo da se vidi da li moze da se poveze baza sa drugim ruterom
app.post ('/addArea', (req, res) =>{
    //Save new area
    db.area.insert({area: req.body.addArea}, (err,docs) =>{
        res.send("Ok");
    })
})

// media routes
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
