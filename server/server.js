const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");

//Insert middleware here omar

app.use(cors());
app.use(express.json());

// //get all the storefronts
// app.get("/getStores", async (req, res) => {
//   try{
//     console.log("Got get all stores request");
//     const results = await db.query("SELECT S.*, AVG(PRODUCT_RATING) AS RATING FROM STOREFRONT S LEFT OUTER JOIN (SELECT P.PRODUCT_ID, P.STOREFRONT_ID, AVG(R.RATING) AS PRODUCT_RATING FROM PRODUCT P JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) GROUP BY P.PRODUCT_ID) P1 ON (S.STOREFRONT_ID = P1.STOREFRONT_ID) GROUP BY S.STOREFRONT_ID");
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         stores: results.rows
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });


// Global strings
const GET_STORE1 = "SELECT S.*, AVG(PRODUCT_RATING) AS RATING FROM STOREFRONT S LEFT OUTER JOIN (SELECT P.PRODUCT_ID, P.STOREFRONT_ID, AVG(R.RATING) AS PRODUCT_RATING FROM PRODUCT P JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) GROUP BY P.PRODUCT_ID) P1 ON (S.STOREFRONT_ID = P1.STOREFRONT_ID)";
const GET_STORE2 = "GROUP BY S.STOREFRONT_ID";

// Route handler
app.get("/getStores", async (req, res) => {
  try {
    console.log("Got get all stores request");
    
    // Construct the full SQL query by concatenating the two parts
    const fullQuery = `${GET_STORE1} ${GET_STORE2}`;

    // Execute the query
    const results = await db.query(fullQuery);

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error"
    });
  }
});




//get a specific storefront
app.get("/getStore/:id", async (req, res) => {
  try{
    console.log("Got get a store request");
    const fullQuery = `${GET_STORE1} WHERE S.STOREFRONT_ID = ${req.params.id} ${GET_STORE2}`;

    const results = await db.query(
      fullQuery
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
//create a storefront
app.post("/createStore", async (req, res) => {
  try{
    console.log("Got a create store request");
    const results = await db.query(
      "INSERT INTO storefront (STOREFRONT_NAME, STOREFRONT_DESCRIPTION, IMAGE) VALUES ($1, $2, $3) RETURNING *",
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
//update a storefront
app.put("/updateStore/:id", async (req, res) => {
  try{
    console.log("Got an update store request");
    const results = await db.query(
      "UPDATE storefront SET STOREFRONT_NAME = $2, STOREFRONT_DESCRIPTION = $3, IMAGE = $4, last_updated_on = CURRENT_TIMESTAMP WHERE storefront_id = $1 RETURNING *",
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
//delete a storefront
app.delete("/deleteStore/:id", async (req, res) => {
  try{
    console.log("Got a delete store request");
    const results = await db.query(
      "DELETE FROM storefront where storefront_id = $1",
      [req.params.id]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});











//get a product
app.get("/getProduct/:productId", async (req, res) => {
  try {
    console.log("Got get a store products request");

    // Use storeId and productId in your query
    const results = await db.query(
      "SELECT * FROM product WHERE product_id = $1",
      [req.params.productId]
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
//update a product
app.put("/updateProduct/:productId", async (req, res) => {
  try{
    console.log("Got an update product request");
    const results = await db.query(
      "UPDATE product SET product_name = $2, product_description = $3, price = $4, image = $5 WHERE product_id = $1 RETURNING *",
      [req.params.productId, req.body.name, req.body.description, req.body.price, req.body.image]
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
//create a product
app.post("/createProduct/:id", async (req, res) => {
  try{
    console.log("Got a create product request");
    const results = await db.query(
      "INSERT INTO product (product_name, product_description, price, image, storefront_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.body.name, req.body.description, req.body.price, req.body.image, req.params.id]
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
//delete a product
app.delete("/deleteProduct/:productId", async (req, res) => {
  try{
    console.log("Got a delete product request");
    const results = await db.query(
      "DELETE FROM product where product_id = $1",
      [req.params.productId]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});





//create an announcement 
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
//delete an announcement
app.delete("/deleteAnnouncement/:announcementId", async (req, res) => {
  try{
    console.log("Got a delete announcement request");
    const results = await db.query(
      "DELETE FROM announcements where announcement_id = $1",
      [req.params.announcementId]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});

//update  an announcement
app.put("/updateAnnouncement/:announcementId", async (req, res) => {
  try{
    console.log("Got an update announcement request");
    const results = await db.query(
      "UPDATE announcements SET announcement_description = $2, image = $3 WHERE announcement_id = $1 RETURNING *",
      [ req.params.announcementId, req.body.description, req.body.image]
    );
    res.status(200).json({
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
//get a specific announcement
app.get("/getAnnouncement/:announcementID", async (req, res) => {
  try {
    console.log("Got get a store announcements request - specific");
     const results = await db.query(
      "SELECT * FROM announcements WHERE announcement_id=$1", [req.params.announcementID]
    );
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



//clear cart
app.delete("/clearCart/:id", async (req, res) => {
  try{
    console.log("Got a clear cart request");
    const results = await db.query(
      "DELETE FROM cart where customer_id = $1",
      [req.params.id]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});
//remove from cart
app.delete("/removeFromCart/:id", async (req, res) => {
  try{
    console.log("Got a remove from cart request");
    const results = await db.query(
      "DELETE FROM cart where customer_id = $1 AND product_id = $2",
      [req.params.id, req.body.productId]
    );
    res.status(204).json({
      status: "success"
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
const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});