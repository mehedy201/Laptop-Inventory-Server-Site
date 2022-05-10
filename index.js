const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0m1f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    await client.connect();
    const assinment11Collection = client.db('assinment11').collection('products');
    // Get data form Server
    app.get('/products', async(req, res) => {
      const query ={};
      const cursor = assinment11Collection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //Get single product from server
    app.get('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await assinment11Collection.findOne(query);
      res.send(product);
    })

    // Get product using email
    app.get('/products/email', async(req, res) =>{
      const email = req.query.email;
      const query = {email: email};
      const cursor = assinment11Collection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    })


    // Post Form Client Side
    app.post('/products', async(req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await assinment11Collection.insertOne(newProduct);
      res.send(result);
    })

    // PUT
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity.quantity
        }
      };
      const result = await assinment11Collection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    // Delete Product
    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await assinment11Collection.deleteOne(query);
      res.send(result);
    })

  }
  finally{

  }
}
run().catch(console.dir);


app.get('/'), (req, res) => {
    res.send('Runnint Assinment server');
}

app.listen(port, () =>{
    console.log('listening Runnig port', port)
})
