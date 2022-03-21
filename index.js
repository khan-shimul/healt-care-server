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
        const usersCollection = database.collection('users');


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

        // user post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });


        // user create or update put api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Make Admin Put Api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            // console.log(req.body)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        // user role admin get api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }

            res.json({ admin: isAdmin })
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

