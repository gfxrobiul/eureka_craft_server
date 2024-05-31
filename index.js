const express = require('express');
const cors =  require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_CRAFT_USER}:${process.env.DB_CRAFT_PASS}@cluster0.1blc0td.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const craftCollection = client.db('craftDB').collection('craft');
    const newCraftCollection = client.db('craftDB').collection('newCraftCollection');





    //new collection for tast get 
    app.get('/newCraft', async(req, res) =>{
      const cursor = newCraftCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    //
    app.get('/newCraft/:subcategory_Name', async (req, res) => {
      const subcategory_Name = req.params.subcategory_Name;
      const query = { subcategory_Name: (subcategory_Name) }
      const matchingArt = await craftCollection.find(query).toArray();
      res.send(matchingArt);
  })



    //post data 
    app.post('/craft', async(req, res) =>{
        const newCraft = req.body;
        console.log(newCraft);
        const result = await craftCollection.insertOne(newCraft);
        res.send(result);
    })
    
    app.get('/craft', async(req, res) =>{
      const cursor = craftCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    
    // update by id
    app.get('/craft/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    
    app.get('/craft/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })

    app.get('/myart/:email', async(req,res)=>{
      const result = await craftCollection.find({userEmail:req.params.email}).toArray();
      res.send(result);
    })

    // delete 
    app.delete('/craft/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })
    //update data 
    app.put('/craft/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true}
      const updatedCraft = req.body;

      const craft ={
        $set:{
          name: updatedCraft.name,
          subCategory_Name: updatedCraft.subCategory_Name ,
          shortdescription: updatedCraft.shortdescription,
           image: updatedCraft.image,
            price: updatedCraft.price,
            rating : updatedCraft.rating,
            customization: updatedCraft.customization,
            processing_time: updatedCraft.processing_time,
        }
      }
      const result = await craftCollection.updateOne(filter,craft,options);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req,res)=>{
    res.send('Art and Craft Server is running')
})
app.listen(port, ()=>{
    console.log(`Art and Craft Server is running on port: ${port}`)
})