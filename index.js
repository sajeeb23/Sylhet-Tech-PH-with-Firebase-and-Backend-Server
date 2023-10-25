const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tr0mbiu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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
        await client.connect();

        const productCollection = client.db('productDB').collection('product');
        
        const brandCollection = client.db('productDB').collection('Brand');

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });



        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.get('/brands', async(req, res) => {
            const result = await brandCollection.find().toArray();
            res.send(result);
        })

        app.get('/product/:brandname', async(req, res) => {
            const brandname = req.params.brandname;
            const query = {brandname: brandname}
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })


        
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        
        app.put('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const option = {upsert: true};
            const updateProduct = req.body;
            const product = {
                $set: {
                    name: updateProduct.name, brandname: updateProduct.brandname, type: updateProduct.type, price: updateProduct.price, description: updateProduct.description, photo: updateProduct.photo,
                }
            }
            const result = await productCollection.updateOne(filter, product, option)
            res.send(result);
        }

        )
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('tech server is running')
})

app.listen(port, () => {
    console.log(`server running on: ${port}`);
})