const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
console.log("Hello");
// MongoDB Connection URI
const uri = 'mongodb://100.79.10.108:27017'; // URI ของ MongoDB

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const dbName = "Trip";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Let\'s Work with MongoDB Databases');
});


app.get('/trips', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection("Trip");
        const restarants = await collection.find({}).toArray();
        res.status(200).send(restarants);
    } catch (err) {
        console.error('Error retrieving restarants:', err);
        res.status(500).send('Error retrieving restarants');
    }
});

app.get('/trips/name/:searchText', async (req, res) => {
  const searchText = req.params.searchText;
  try {
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection("Trip");

      //for search text
      const regex = new RegExp(searchText, 'i');
      const query = { name: { $regex: regex } };

      const results = await collection.find(query).toArray();
      console.log("Result: " + JSON.stringify(results));
      res.status(200).send(results);
  } catch (err) {
      console.log('Database connection error:', err);
      res.status(500).send('Database connection error');
  } 
});

app.delete('/trips/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Select the database and collection
      const db = client.db(dbName);
      const collection = db.collection("Trip");

      // Construct the filter to match the document by _id
      const filter = { _id: new ObjectId(id) }; // แก้ไขตรงนี้เพื่อใช้ new ObjectId(id)

      // Delete a single document matching the filter
      const result = await collection.deleteOne(filter);

      if (result.deletedCount === 1) {
          console.log(id, 'Deleted');
          res.status(200).send(`restarant with ID ${id} deleted successfully`);
      } else {
          console.log('No restarant found with the provided ID:', id);
          res.status(404).send(`No restarant found with the provided ID: ${id}`);
      }
  } catch (err) {
      console.log('Database connection error:', err);
      res.status(500).send('Database connection error');
  } 
});

app.post('/trips/create', async (req, res) => {
  // Get restarant data from the request body
  const restarant = req.body;

  try {
      // Select the database and collection
      const db = client.db(dbName);
      const collection = db.collection("Trip");

      // Insert the new restarant document into the collection
      const result = await collection.insertOne(restarant);

      console.log('Restarant created:', result.insertedId);
      res.status(200).send();
  } catch (err) {
      console.error('Error creating restarant:', err);
      res.status(500).send('Error creating restarant');
  }
});

// app.put('/trips/update/', async (req, res) => {
//   const db = client.db(dbName);
//   const restaurant = req.body;
//   const restaurantID = restaurant._id;
  
//   try {
//       // Construct the filter to find the restaurant record
//       const filter = { _id: new ObjectId(restaurantID) };

//       // Construct the update operation
//       const updateOperation = {
//           $set: {
//               restaurant_name: restaurant.name,
//               num_reviews: restaurant.num_reviews,
//               ranking_out_of: restaurant.ranking_out_of,
//               ranking: restaurant.ranking,
//               rating: restaurant.rating,
//               price_level: restaurant.price_level
//           }
//       };

//       // Execute the update operation


//       const result = await db.collection('Trip').updateOne(filter, updateOperation);

//       if (result.modifiedCount === 1) {
//           console.log(`${restaurant.restaurant_name} with ID ${restaurantID} is updated.`);
//           res.status(200).send('Restaurant updated successfully');
//       } else {
//           console.log('Restaurant not found or not updated.');
//           res.status(404).send('Restaurant not found or not updated');
//       }
//   } catch (err) {
//       console.log('Error updating restaurant:', err);
//       res.status(500).send('Error updating restaurant');
//   }
// });

app.put('/trips/update/:id', async (req, res) => {
  const db = client.db(dbName);
  const restaurant = req.body;
  const restaurantID = req.params.id; // เปลี่ยนจากการใช้ restaurant._id เป็น req.params.id
  
  try {
      // Construct the filter to find the restaurant record
      const filter = { _id: new ObjectId(restaurantID) };

      // Construct the update operation
      const updateOperation = {
          $set: {
              name: restaurant.name,
              num_reviews: restaurant.num_reviews,
              ranking_out_of: restaurant.ranking_out_of,
              ranking: restaurant.ranking,
              rating: restaurant.rating,
              price_level: restaurant.price_level
          }
      };

      // Execute the update operation

      const result = await db.collection('Trip').updateOne(filter, updateOperation);

      if (result.modifiedCount === 1) {
          console.log(`ID ${restaurantID} is updated.`);
          res.status(200).send('Restaurant updated successfully');
      } else {
          console.log('Restaurant not found or not updated.');
          res.status(404).send('Restaurant not found or not updated');
      }
  } catch (err) {
      console.log('Error updating restaurant:', err);
      res.status(500).send('Error updating restaurant');
  }
});

// app.put('/update/:id', async (req, res) => {
//   try {
//       const client = await MongoClient.connect(url);
//       const db = client.db(dbName);
//       const collection = db.collection("Trip");

//       const id = req.params.id;
//       const newData = req.body;

//       await collection.updateOne({ _id: ObjectID(id) }, { $set: newData });

//       client.close();
//       res.status(200).send('Update successful');
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//   }
// });

app.get('/trips/:searchId', async (req, res) => {
  const searchId = req.params.searchId;
  try {
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection("Trip");

      //for search by id
      const query = { _id: new ObjectId(searchId) }; // Ensure you have ObjectId imported and available in this scope

      const result = await collection.findOne(query);
      
      console.log("Result: " + JSON.stringify(result));
      res.status(200).send(result);
  } catch (err) {
      console.log('Database connection error:', err);
      res.status(500).send('Database connection error');
  } 
});




app.post('/Login', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Select the database and collection
        const db = client.db(dbName);
        const collection = db.collection('user');

        // Find user with matching Username and Password
        const user = await collection.findOne({ Username, Password });

        if (user) {
            res.status(200).send("Login successful");
            console.log("log");
            
        } else {
            // If user is not found, send error response
            res.status(400).send('Invalid Username or Password');
        }
    } catch (error) {
        // Handle error
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    } 
});

