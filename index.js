const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 8080


app.get('/', (req, res) => {
  res.send('Welcome to doctors portal backend')
})


client.connect(err => {
    const appointmentsCollection = client.db(`${process.env.DB_HOST}`).collection("appoinments");
    app.post("/addAppoint", (req, res) => {

        const appoinment = req.body;
        appointmentsCollection.insertOne(appoinment)
        .then(result => {

            res.send(result.insertedCount > 0)
        })
    })


    //show all appointments 
    app.get("/appointments", (req, res) => {

        const paramEmail = req.query.email;
        appointmentsCollection.find({email: paramEmail})
        .toArray((error, documents) => {

            res.send(documents);
        })
    })


    console.log("Database Connected");

});


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})