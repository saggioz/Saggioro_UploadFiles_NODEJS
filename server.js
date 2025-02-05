const express = require("express");
const http = require('http');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

const uploadDirectory = path.join(__dirname, 'files');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDirectory);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

// aggiunta filelist
app.get("/filelist", (req, res) => {
    let files = fs.readdirSync(uploadDirectory);
    files = files.map(file => "./files/" + file);
    res.json(files);
});


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        console.log('File caricato:', req.file.filename);
        res.json({ url: "./files/" + req.file.filename });
    });
});

// Avvia il server
const server = http.createServer(app);
server.listen(5600, () => {
    console.log("- server running");
});