const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortid = require("shortid");

const app = express();
app.use(bodyParser.json({
    strict:false
}));

// mongoose.connect("mongodb://localhost/react-shopping-cart-db", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });
const MONGODB_URI = "mongodb://localhost/react-shopping-cart-db";
const connection = {};
async function connect() {
    if (connection.isConnected) {
      console.log('already connected');
      return;
    }
    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) {
        console.log('use previous connection');
        return;
      }
      await mongoose.disconnect();
    }
    const db = await mongoose.connect(MONGODB_URI,  {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('new connection');
    connection.isConnected = db.connections[0].readyState;
  }

  async function disconnect() {
    
        await mongoose.disconnect();
        connection.isConnected = false;
      
  }

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    title: {type:String},
    description: String,
    image: String,
    availableSizes: [String],
    price: Number,
    _id: { type: String, default: shortid.generate },
  },
  {
    timestamps: true,
  })
);

app.get("/api/products", async (req, res) => {
    await connect();
  const products = await Product.find({});
  await disconnect();
  res.send(products);
});

app.post("/api/products", async (req, res) => {
    await connect();
  const newProduct = new Product(req.body);
  
  console.log(newProduct);
  const savedProduct = await newProduct.save();
  await disconnect();
  res.send(savedProduct);
});

app.delete("/api/products/:id", async (req, res) => {
    await connect();
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  await disconnect();
  res.send(deletedProduct);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("serve at http://localhost:5000"));
