const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je3vw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function server() {
    try {
        await client.connect();
        // Database & Collection
        const database = client.db('end_game');
        const doctorsCollection = database.collection('doctors');
        const appointmentsCollection = database.collection('appointments');


        // Doctors post api
        app.post('/doctors', async (req, res) => {
            const doctors = req.body.data;
            const result = await doctorsCollection.insertOne(doctors);
            // console.log(result)
            res.json(result);
        });


        // Doctors get api
        app.get('/doctors', async (req, res) => {
            const cursor = doctorsCollection.find({});
            const doctors = await cursor.toArray();
            res.send(doctors);

        });

        // Find Single Doctors Api
        app.get('/doctors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const doctor = await doctorsCollection.findOne(query);
            res.send(doctor);
        });

        // appointments post api
        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result)
        });

    }
    finally {
        // await client.close();
    }

}
server().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello End-Game!')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

