const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Pzu2RoYOMhY2xZrn
// droneDb

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.431bv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
  try{
    await client.connect();
    const database = client.db('dronedb');
    const productCollection = database.collection('products');
    const orderCollection = database.collection('orders');
    const usersCollection = database.collection('users');
    const reviewsCollection = database.collection('reviews');

    //GET Products API
    app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();

            res.send(products);
            });

            //  delete product
           app.delete('/products/:id', async(req,res) =>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)};
               const result = await productCollection.deleteOne(query);
               res.json(result)
           })

           // post api for adding products
                   app.post('/products', async(req,res) => {
                       const product = req.body;
                       const result = await productCollection.insertOne(product);
                       res.json(result)
                   })

            // post api for orders
                app.post('/orders', async(req,res) => {
                    const orders = req.body;
                    const result = await orderCollection.insertOne(orders);
                    res.json(result)
                })

// get orders with specific email
                app.get('/orders', async (req, res) => {
                        const email = req.query.email;
                        const query = {email: email}
                        const cursor = orderCollection.find(query);
                        const products = await cursor.toArray();

                        res.send(products);
                        });


  // get all orders
                    app.get('/order', async (req, res) => {
                                  const cursor = orderCollection.find({});
                                  const products = await cursor.toArray();

                                  res.send(products);
                                });


              // update order
        app.put('/orders/:id', async(req,res) =>{
            const id = req.params.id;
            const updateStatus = req.body.state;
            const filter = {_id: ObjectId(id)};
            const option = {upsert:true}

            const updateDoc = {
              $set: {
                status: updateStatus
              }
            }
            const result = await orderCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        })

        //  delete order
       app.delete('/order/:id', async(req,res) =>{
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const result = await orderCollection.deleteOne(query);
           res.json(result)
       })

       // usersCollection
       app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

// make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // review

        // post api for reviews
            app.post('/reviews', async(req,res) => {
                const reviews = req.body;
                const result = await reviewsCollection.insertOne(reviews);
                res.json(result)
            })

            // get all reviews
            app.get('/reviews', async (req, res) => {
                      const cursor = reviewsCollection.find({});
                      const products = await cursor.toArray();
                      res.send(products);
                    });


  }
  finally{

  }
}
run().catch(console.dir)

app.get('/',(req,res) => {
  res.send('hello drone-app')
})

app.listen(port,() =>{
  console.log("app listing at",port);
})
