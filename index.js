const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjixa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());
app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("digitalDeviceServicing").collection("services");
    const techniciansCollection = client.db("digitalDeviceServicing").collection("technicians");
    const reviewsCollection = client.db("digitalDeviceServicing").collection("reviews");
    const ordersCollection = client.db("digitalDeviceServicing").collection("orders");
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const servicename = req.body.servicename;
        const cost = req.body.cost;
        const type = req.body.type;
        const email = req.body.email;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ servicename, email, image, cost, type })
            .then(result => {
                console.log('done');
                res.send(result.insertedCount > 0);
            })
    })


    app.post('/addTechnicians', (req, res) => {

        const name = req.body.name;

        const email = req.body.email;

        const photoUrl = req.body.photoUrl;
        console.log('gpne');


        techniciansCollection.insertOne({ name, email, photoUrl })
            .then(result => {
                console.log('gone');
                res.send(result.insertedCount > 0);
            })
    })
    app.post('/addReview', (req, res) => {

        const name = req.body.name;

        const email = req.body.email;

        const review = req.body.review;
        const photoURL = req.body.photoURL;
        console.log('gpne');


        reviewsCollection.insertOne({ name, email, review, photoURL })
            .then(result => {
                console.log('gone');
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log('doe');
                res.send(result.insertedCount > 0)
            })
    });
    app.post('/isTechnician', (req, res) => {
        const email = req.body.email;
        //console.log('dpfsa');
        techniciansCollection.find({ email: email })
            .toArray((err, technicians) => {
                res.send(technicians.length > 0);
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
        app.get('/technicians', (req, res) => {
           
        techniciansCollection.find({})
        
            .toArray((err, documents) => {
                res.send(documents);
                console.log('done');
            })
    });
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });


    app.post('/userOrders', (req, res) => {

        const email = req.body.email;

        ordersCollection.find({ email: email })
            .toArray((err, documents) => {
                console.log(email, documents)
                res.send(documents);
            })
    })
    
    app.get('/adminOrder',(req,res)=>{
        ordersCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

    app.post('/updateOrder', (req, res) => {

        const id = ObjectID(req.body.id);
        const status=req.body.status;
        console.log(id,status);
           
         const result=ordersCollection.updateOne({_id:id},{
                $set:{
                    status: status
                }  
            });
            res.send(result);
        
       
    })

app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection.findOneAndDelete({ _id: id })
        .then(documents => res.send(!!documents.value))
})
  

});
app.listen(process.env.PORT || port)