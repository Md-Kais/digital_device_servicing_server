const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000;
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("digitalDeviceServicing").collection("services");
    // perform actions on the collection object
    
});
app.listen(process.env.PORT || port)