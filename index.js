require("dotenv").config()

const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app)
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const port = process.env.PORT || 3728;
const consola = require("consola")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    consola.info("Connected to MongoDB");
}).catch(error => {
    consola.info("An error occured while connecting to MongoDB");
    consola.error(error);
})

const db = mongoose.connection

require("./router")(app, consola, db)
require("./checkSU")(app, consola, db)

server.listen(port, () => {
    consola.info("Server started on port " + port);
})