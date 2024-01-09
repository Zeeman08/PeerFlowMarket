const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");

//Insert middleware here omar

app.use(cors());
app.use(express.json());

//Get all people
app.get("/getPeople", async (req, res) => {
  try{
    console.log("Got get all people request");
    const results = await db.query("SELECT * FROM test");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        people: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
//Get a person
app.get("/getPeople/:id", async (req, res) => {
  try{
    console.log("Got get a person request");
    const results = await db.query(
      "SELECT * FROM test WHERE id = $1", [req.params.id]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        people: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});



//get all the storefronts
app.get("/getStores", async (req, res) => {
  try{
    console.log("Got get all stores request");
    const results = await db.query("SELECT * FROM storefront");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
//get a specific storefront
app.get("/getStore/:id", async (req, res) => {
  try{
    console.log("Got get a store request");
    const results = await db.query(
      "SELECT * FROM storefront WHERE storefront_id = $1", [req.params.id]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//get all the products of a storefront
app.get("/getStoreProducts/:id", async (req, res) => {
  try{
    console.log("Got get a store products request");
    const results = await db.query(
      "SELECT * FROM product WHERE storefront_id = $1", [req.params.id]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        products: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
//get a specific product of a specific storefront
app.get("/getStoreProducts/:storeId/:productId", async (req, res) => {
  try {
    console.log("Got get a store products request");

    const { storeId, productId } = req.params;

    // Use storeId and productId in your query
    const results = await db.query(
      "SELECT * FROM product WHERE storefront_id = $1 AND product_id = $2",
      [storeId, productId]
    );

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        product: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});
//get all the announcements of a storefront
app.get("/getStoreAnnouncements/:id", async (req, res) => {
  try{
    console.log("Got get a store announcements request");
    const results = await db.query(
      "SELECT * FROM announcements WHERE storefront_id = $1", [req.params.id]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        announcements: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
//get a specific announcement of a storefront
app.get("/getStoreAnnouncements/:storeID/:announcementID", async (req, res) => {
  try {
    console.log("Got get a store announcements request - specific");
    const { storeID, announcementID } = req.params;   //interesting syntax, the url parameters and the variables must be the same name
    const results = await db.query(
      "SELECT * FROM announcements WHERE storefront_id = $1 AND announcement_id=$2", [storeID, announcementID]
    );
    console.log(storeID, announcementID);
    console.log(results.rows[0]);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        announcements: results.rows
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});
//create a storefront
app.post("/createStore", async (req, res) => {
  try{
    console.log("Got a create store request");
    const results = await db.query(
      "INSERT INTO storefront (name, description, image) VALUES ($1, $2, $3) RETURNING *",
      [req.body.name, req.body.description, req.body.image]
    );
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//create a product for a storefront
app.post("/createProduct/:id", async (req, res) => {
  try{
    console.log("Got a create product request");
    const results = await db.query(
      "INSERT INTO product (product_name, product_description, price, image, storefront_id, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.body.name, req.body.description, req.body.price, req.body.image, req.params.id, req.body.tags.toString()]
    );
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        products: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//create an announcement for a storefront
app.post("/createAnnouncement/:id", async (req, res) => {
  try{
    console.log("Got a create announcement request");
    const results = await db.query(
      "INSERT INTO announcements (STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, IMAGE) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, req.body.description, req.body.image]
    );
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        announcements: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//update a storefront
app.put("/updateStore/:id", async (req, res) => {
  try{
    console.log("Got an update store request");
    const results = await db.query(
      "UPDATE storefront SET name = $2, description = $3, image = $4, last_updated_on = CURRENT_TIMESTAMP WHERE storefront_id = $1 RETURNING *",
      [req.params.id, req.body.name, req.body.description, req.body.image]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//update a product for a storefront
app.put("/updateProduct/:storeId/:productId", async (req, res) => {
  try{
    console.log("Got an update product request");
    const results = await db.query(
      "UPDATE product SET product_name = $3, product_description = $4, price = $5, image = $6, tags = $7 WHERE storefront_id = $1 AND product_id = $2 RETURNING *",
      [req.params.storeId, req.params.productId, req.body.name, req.body.description, req.body.price, req.body.image, req.body.tags.toString()]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        products: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});


//Create a person
app.post("/createPeople", async (req, res) => {
  try{
    console.log("Got a create person request");
    const results = await db.query(
      "INSERT INTO test (id, name) VALUES ($1, $2) RETURNING *",
      [req.body.id, req.body.description]
    );
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        people: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});

//Update a person
app.put("/updatePeople/:id", async (req, res) => {
  try{
    console.log("Got an update person request");
    const results = await db.query(
      "UPDATE test SET name = $2 WHERE id = $1 RETURNING *",
      [req.params.id, req.body.name]
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        people: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});

//Delete a person
app.delete("/deletePeople/:id", async (req, res) => {
  try{
    console.log("Got a delete person request");
    const results = await db.query(
      "DELETE FROM test where id = $1",
      [req.params.id]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});

const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});