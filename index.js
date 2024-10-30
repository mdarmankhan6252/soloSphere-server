const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
   origin:['http://localhost:5173'],
   credentials:true,
   optionsSuccessStatus:200
}))
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
   app.get('/jobs', async(req, res) =>{
      const result = await jobsCollection.find().toArray();
      res.send(result)      
   })

   //get a single data
   app.get('/job/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await jobsCollection.findOne(query)
      res.send(result)
   })

   //post a data to the database
   app.post('/bids', async(req, res) =>{
      const bid = req.body;
      const result = await bidsCollection.insertOne(bid);
      res.send(result)
      console.log(bid)
   })
   



    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
   //

  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
   res.send('My server is running...')
})

app.listen(port, () =>{
   console.log('my server is running on port : ',port)
})
