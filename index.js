const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {

      const jobsCollection = client.db('SoloSphereDB').collection('jobs')
      const bidsCollection = client.db('SoloSphereDB').collection('bids')

      //get all jobs data.
      app.get('/jobs', async (req, res) => {
         const result = await jobsCollection.find().toArray();
         res.send(result)
      })

      //get a single data
      app.get('/jobs/:email', async (req, res) => {
         const email = req.params.email;
         const query = { 'buyer.buyer_email': email }
         const result = await jobsCollection.find(query).toArray();
         res.send(result)
      })

      app.post('/job', async (req, res) => {
         const job = req.body;
         const result = await jobsCollection.insertOne(job);
         res.send(result)
      })

      app.delete('/job/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await jobsCollection.deleteOne(query)
         res.send(result)
      })

      app.get('/job/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await jobsCollection.findOne(query)
         res.send(result)
      })

      app.put('/job/:id', async (req, res) => {
         const id = req.params.id;
         const job = req.body;
         const filter = { _id: new ObjectId(id) }
         const options = { upsert: true }
         const updateJob = {
            $set: {
               ...job
            }
         }
         const result = await jobsCollection.updateOne(filter, updateJob, options)
         res.send(result)
      })

      // bids related api.

      app.get('/my-bids/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email : email }
         const result = await bidsCollection.find(query).toArray();
         res.send(result)
      })

      app.get('/bid-request/:email', async(req, res) =>{
         const email = req.params.email;
         const query = {'buyer.buyer_email' : email}
         const result = await bidsCollection.find(query).toArray();
         res.send(result)
      })

      //post a data to the database
      app.post('/bids', async (req, res) => {
         const bid = req.body;
         const result = await bidsCollection.insertOne(bid);
         res.send(result)
      })

      app.patch('/bid/:id', async(req, res) =>{
         const id = req.params.id;
         const status = req.body;
         const query = {_id : new ObjectId(id)}
         const updatedDoc = {
            $set : status
         }
         const result = await bidsCollection.updateOne(query, updatedDoc)
         res.send(result)
      })






      await client.db("admin").command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
   } finally {
      //

   }
}
run().catch(console.dir);




app.get('/', (req, res) => {
   res.send('My server is running...')
})

app.listen(port, () => {
   console.log('my server is running on port : ', port)
})
