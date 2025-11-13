const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mimafsana43:ReUtSZlf23vb8ULl@cluster0.wanqs4m.mongodb.net/?appName=Cluster0";

const clientOptions = new MongoClient(uri,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true, // <-- debug only
  });

async function run() {
  try {
    await clientOptions.connect();
    const db = clientOptions.db('Food_db');
    const assignmentCollection = db.collection('Foods');

    app.get('/Foods', async (req, res) => {
      try {
        const result = await assignmentCollection.find().limit(6).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch documents', details: err.message });
      }
    });

    app.get('/FoodAll', async (req, res) => {
      try {
        const result = await assignmentCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch documents', details: err.message });
      }
    });

    app.get('/', (req, res) => {
      res.send('Hello World Mim!')
    })

    //post method
    //insertOne
    //insertMany

    app.post('/Foods',async(req,res)=>{
      const data = req.body
      console.log(data)
      const result = await assignmentCollection.insertOne(data)
      res.send({
        success : true,
        result
      })
    })

    app.post('/FoodAll',async(req,res)=>{
      const data = req.body
      console.log(data)
      const result = await assignmentCollection.insertOne(data)
      res.body({
        success : true,
        result
      })
    })

    app.get('/Foods/:id', async(req, res)=>{
      const {id} = req.params
      console.log(id)
      const objectId =  new ObjectId(id)

      const result = await assignmentCollection.findOne({_id: objectId})

      res.send({
        success: true,
        result
      })
    })

    app.put('/updateProp/:id', async(req, res)=>{
      const {id} = req.params
      const data = req.body
      // console.log(id)
      // console.log(data)
      const objectId =  new ObjectId(id)
      const filter = {_id : objectId}
      const update = {
        $set : data
      }

      const result = await assignmentCollection.updateOne(filter, update)

      res.send({
        success: true,
        result
      })
    })


     app.delete('/Foods/:id', async(req, res)=>{
      const {id} = req.params
      console.log(id)
      // const objectId =  new ObjectId(id)
      // const filter = {_id : objectId}

      const result = await assignmentCollection.deleteOne({_id: new ObjectId(id)})

      res.send({
        success: true,
        result
      })
    })


    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })


    await clientOptions.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);


