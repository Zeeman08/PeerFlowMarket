const express = require("express");
const app = express();
const db = require("./db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

//Insert middleware here omar

app.use(cors());
app.use(express.json());



// ROUTES //


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../client/src/images')); // Use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// uploading images route
app.post("/upload", upload.single('image'), async (req, res) => {
  try {
    console.log("Got an image upload request");

    // Send the filename in the response
    res.status(201).json({
      status: "success",
      filename: req.file.filename,
      data: {}
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//register and login

app.use("/auth", require("./routes/jwtAuth"));

//dashbaoard route

app.use("/dashboard", require("./routes/dashboard"));









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
const GET_STORE1 = "SELECT S.*, COALESCE(ROUND(AVG(PRODUCT_RATING)), 0) AS RATING FROM STOREFRONT S LEFT OUTER JOIN (SELECT P.PRODUCT_ID, P.STOREFRONT_ID, AVG(R.RATING) AS PRODUCT_RATING FROM PRODUCT P JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) GROUP BY P.PRODUCT_ID) P1 ON (S.STOREFRONT_ID = P1.STOREFRONT_ID)";
const GET_STORE2 = "GROUP BY S.STOREFRONT_ID";
const GET_PRODUCT1 = "SELECT P.*, COALESCE(AVG(R.RATING), 0) AS PRODUCT_RATING FROM PRODUCT P LEFT OUTER JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID)";
const GET_PRODUCT2 = "GROUP BY P.PRODUCT_ID";

// get all the stores
app.get("/getStores", async (req, res) => {
  try {
    console.log("Got get all stores request");
    const rowsPerPage = req.query.rows_per_page || 10; // Default to 10 rows per page if not provided
    const pageNumber = req.query.page_number || 1; // Default to the first page if not provided
    const offset = (pageNumber - 1) * rowsPerPage;
    // Execute the query
    let x = 0;
    //let query = `${GET_STORE1}`;
    let query = `SELECT S.*, COALESCE(ROUND(AVG(PRODUCT_RATING)), 0) AS RATING, (SELECT category_name FROM CATEGORIES C WHERE S.category_id = C.category_id) AS CATEGORY FROM STOREFRONT S LEFT OUTER JOIN (SELECT P.PRODUCT_ID, P.STOREFRONT_ID, AVG(R.RATING) AS PRODUCT_RATING FROM PRODUCT P JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) GROUP BY P.PRODUCT_ID) P1 ON (S.STOREFRONT_ID = P1.STOREFRONT_ID)`;
    
    if (req.query.search !== undefined && req.query.search !== "") {
      query += ` ${x>0?'AND':'WHERE'} LOWER(S.STOREFRONT_NAME) LIKE LOWER('%${req.query.search}%')`;
      x=1;
    }
    if (req.query.category !== undefined && req.query.category !== "All") {
      query += ` ${x>0?'AND':'WHERE'} S.STOREFRONT_ID IN (SELECT STOREFRONT_ID FROM STOREFRONT STR WHERE (SELECT CATEGORY_NAME FROM CATEGORIES WHERE CATEGORY_ID = STR.CATEGORY_ID) = '${req.query.category}')`;
      x=1;
    }
    query += ` ${GET_STORE2} ORDER BY S.STOREFRONT_ID OFFSET ${offset} LIMIT ${rowsPerPage}`;
    const results = await db.query(query);

    let query1 = 'SELECT COUNT(*) FROM STOREFRONT';
    x = 0;
    if (req.query.search !== undefined && req.query.search !== "") {
      query1 += ` ${x>0?'AND':'WHERE'} LOWER(STOREFRONT_NAME) LIKE LOWER('%${req.query.search}%')`;
      x=1;
    }
    if (req.query.category !== undefined && req.query.category !== "All") {
      query1 += ` ${x>0?'AND':'WHERE'} STOREFRONT_ID IN (SELECT STOREFRONT_ID FROM STOREFRONT STR WHERE (SELECT CATEGORY_NAME FROM CATEGORIES WHERE CATEGORY_ID = STR.CATEGORY_ID) = '${req.query.category}')`;
      x=1;
    }
    const result1 = await db.query(query1);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows,
        totalPages: Math.ceil(result1.rows[0].count / rowsPerPage)
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
//get the stores managed by a person
app.get("/getStoresManagedByPerson/:id", async (req, res) => {
  try{
    console.log("Got get a store request by person");
    const rowsPerPage = req.query.rows_per_page || 10; // Default to 10 rows per page if not provided
    const pageNumber = req.query.page_number || 1; // Default to the first page if not provided
    const offset = (pageNumber - 1) * rowsPerPage;
    let x = 0;
    let query = `SELECT S.*, COALESCE(ROUND(AVG(PRODUCT_RATING)), 0) AS RATING, (SELECT category_name FROM CATEGORIES C WHERE S.category_id = C.category_id) AS CATEGORY FROM STOREFRONT S LEFT OUTER JOIN (SELECT P.PRODUCT_ID, P.STOREFRONT_ID, AVG(R.RATING) AS PRODUCT_RATING FROM PRODUCT P JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) GROUP BY P.PRODUCT_ID) P1 ON (S.STOREFRONT_ID = P1.STOREFRONT_ID)`;
    x = 1;
    query += ` WHERE is_manager_of_storefront(${req.params.id}, S.STOREFRONT_ID) > 0`
    if (req.query.search !== undefined && req.query.search !== "") {
      query += ` ${x>0?'AND':'WHERE'} LOWER(S.STOREFRONT_NAME) LIKE LOWER('%${req.query.search}%')`;
      x=1;
    }
    if (req.query.category !== undefined && req.query.category !== "All") {
      query += ` ${x>0?'AND':'WHERE'} S.STOREFRONT_ID IN (SELECT STOREFRONT_ID FROM CATEGORY_ASSIGNMENT WHERE CATEGORY_NAME = '${req.query.category}')`;
      x=1;
    }
    query += ` GROUP BY S.STOREFRONT_ID ORDER BY S.STOREFRONT_ID OFFSET ${offset} LIMIT ${rowsPerPage}`;
    const results = await db.query(query);

    let query1 = `SELECT COUNT(*) FROM STOREFRONT S WHERE is_manager_of_storefront(${req.params.id}, S.STOREFRONT_ID) > 0`;
    const result1 = await db.query(query1);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows,
        totalPages: Math.ceil(result1.rows[0].count / rowsPerPage)
      }
    });
  }catch(err){
    console.log(err);
  }
});


//create a storefront
app.post("/createStore", async (req, res) => {
  try{
    console.log(req.body);
    console.log("Got a create store request");
    const results = await db.query(
      "INSERT INTO storefront (STOREFRONT_NAME, CATEGORY_ID, STOREFRONT_DESCRIPTION, IMAGE) VALUES ($1, (SELECT CATEGORY_ID FROM CATEGORIES WHERE CATEGORY_NAME = $2), $3, $4) RETURNING *",
      [req.body.name, req.body.category, req.body.description, req.body.image]
    );

    const resultsb = await db.query("INSERT INTO manages (PERSON_ID, STOREFRONT_ID) VALUES ($1, $2) RETURNING *", [req.body.owner, results.rows[0].storefront_id]);
    
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        stores: results.rows[0],
        manages: resultsb.rows[0],
      }
    });
  }catch(err){
    console.log(err);
  }
});
// app.post("/createStore", async (req, res) => {
//   try{
//     console.log("Got a create store request");
//     const results = await db.query(
//       "INSERT INTO storefront (STOREFRONT_NAME, STOREFRONT_DESCRIPTION, IMAGE) VALUES ($1, $2, $3) RETURNING *",
//       [req.body.name, req.body.description, req.body.image]
//     );
//     const results1 = await db.query (
//       "INSERT INTO manages (person_id, storefront_id) VALUES ($1, $2) RETURNING *",
//        [1, results.rows[0].storefront_id]
//     res.status(201).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         stores: results.rows[0]
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });
//update a storefront
app.put("/updateStore/:id/:pid", async (req, res) => {
  try{
    console.log("Got an update store request");
    let query = "";
    let params = [
      req.params.id,
      req.body.name,
      req.body.description
    ];
    if(req.body.image === undefined){
      query = "UPDATE storefront SET STOREFRONT_NAME = $2, STOREFRONT_DESCRIPTION = $3, last_updated_on = CURRENT_TIMESTAMP WHERE storefront_id = $1 RETURNING *";
    }
    else {
      query = "UPDATE storefront SET STOREFRONT_NAME = $2, STOREFRONT_DESCRIPTION = $3, IMAGE = $4, last_updated_on = CURRENT_TIMESTAMP WHERE storefront_id = $1 RETURNING *";
      params.push(req.body.image);
    }

    const results = await db.query(
      query, params
    );

    const response = await db.query("INSERT INTO ACTION_LOG (PERSON_ID, STOREFRONT_ID, ACTION_TYPE) VALUES ($1, $2, 'UPDATE')", [req.params.pid, req.params.id]);

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data
      : {
        stores: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});
//delete a storefront
app.delete("/deleteStore/:id/:personid", async (req, res) => {
  try{
    console.log("Got a delete store request");
    const results = await db.query(
      'CALL delete_storefront_procedure($1, $2)',
      [req.params.personid, req.params.id]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/addmanager/:id", async (req, res) => {
  try {
    console.log("Got a add manager request");
    const res1 = await db.query(
      "SELECT * FROM person WHERE person_id = $1",
      [req.body.manid]
    );

    if (res1.rows.length === 0 || res1.rows[0].person_name !== req.body.name) {
      res.status(404).json({
        status: "error",
        message: "Person not found"
      });
      return;
    }

    const res2 = await db.query(
      "SELECT * FROM manages WHERE person_id = $1 AND storefront_id = $2",
      [req.body.manid, req.params.id]
    );

    if (res2.rows.length > 0) {
      res.status(409).json({
        status: "error",
        message: "Person is already a manager"
      });
      return;
    }

    const res3 = await db.query(
      "INSERT INTO manages (PERSON_ID, STOREFRONT_ID) VALUES ($1, $2) RETURNING *",
      [req.body.manid, req.params.id]
    );
    res.status(201).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

//geTINGt all the storefronts which are in a couple of categories, separated by commas, all lowercase
// app.get("/getStoreCategories/:categories", async (req, res) => {
//   try{
//     console.log("Got get a store categories request");
//     const categories = req.params.categories.split(",");
//     let query = `(${GET_STORE1} WHERE S.STOREFRONT_ID IN (SELECT STOREFRONT_ID S1 FROM CATEGORY_STOREFRONT_RELATION WHERE CATEGORY_NAME = '${categories[0]}') ${GET_STORE2})`;
//     for(let i = 1; i < categories.length; i++){
//       query += ` UNION (${GET_STORE1} WHERE S.STOREFRONT_ID IN (SELECT STOREFRONT_ID S1 FROM CATEGORY_STOREFRONT_RELATION WHERE CATEGORY_NAME = '${categories[i]}') ${GET_STORE2})`;
//     }
//     console.log(query);
//     const results = await db.query(
//       query
//     );
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

//Getting categories
app.get("/getCategories", async (req, res) => {
  try {

    console.log("Sending all cats");
    // Getting all categories
    const results = await db.query(
      "SELECT * FROM categories"
    );

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        categories: results.rows
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























//get a product
app.get("/getProduct/:productId", async (req, res) => {
  try {
    console.log("Got get a product request");
    const query = `${GET_PRODUCT1} WHERE P.PRODUCT_ID = ${req.params.productId} ${GET_PRODUCT2}`;
    // Use storeId and productId in your query
    const results = await db.query(
      query
    );
    const results1 = await db.query(
      "SELECT TAG_NAME FROM TAG_ASSIGNMENT WHERE PRODUCT_ID = $1",
      [req.params.productId]
    )
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        product: {
          ...results.rows[0],
          tags: results1.rows.map((row) => row.tag_name),
        }
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
    //check if req.body has image
    let query = "";
    let params = [
      req.params.productId,
      req.body.name,
      req.body.description,
      req.body.price,
      req.body.stock
    ];
    if(req.body.image === undefined){
      query = "UPDATE product SET product_name = $2, product_description = $3, price = $4, stock_count = $5, last_updated_on = CURRENT_TIMESTAMP WHERE product_id = $1 RETURNING *";
    }
    else {
      query = "UPDATE product SET product_name = $2, product_description = $3, price = $4, stock_count = $5, image = $6, last_updated_on = CURRENT_TIMESTAMP WHERE product_id = $1 RETURNING *";
      params.push(req.body.image);
    }
    const results = await db.query(query, params);
    const res2 = await db.query(
      "UPDATE storefront SET last_updated_on = CURRENT_TIMESTAMP WHERE storefront_id = (SELECT storefront_id FROM product WHERE product_id = $1)",
      [req.params.productId]
    );
    const res3 = await db.query(
      "DELETE FROM TAG_ASSIGNMENT WHERE PRODUCT_ID = $1",
      [req.params.productId]
    );
    const tagResults = await Promise.all(
      req.body.tags.map(async (tag) => {
        try {
          return await db.query(
            "INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES($1, $2) RETURNING *",
            [req.params.productId, tag]
          );
        } catch (error) {
          console.error('Error inserting tag assignments table:', error);
        }
      })
    );

    const res4 = await db.query("INSERT INTO ACTION_LOG (STOREFRONT_ID, PRODUCT_ID, ACTION_TYPE) VALUES ((SELECT STOREFRONT_ID FROM PRODUCT WHERE PRODUCT_ID = $1), $1, 'UPDATE')", [req.params.productId]);
    
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
  try {
    console.log("Got a create product request");
    const results = await db.query(
      "INSERT INTO product (product_name, product_description, stock_count, price, image, storefront_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.body.name, req.body.description, req.body.stock, req.body.price, req.body.image, req.params.id]
    );
    console.log("found one");
    const productId = results.rows[0].product_id;

    // Inserting into tags table, not allowing duplicates
    const tagResults = await Promise.all(
      req.body.tags.map(async (tag) => {
        try {
          return await db.query(
            "INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT (tag_name) DO NOTHING RETURNING *",
            [tag]
          );
        } catch (error) {
          console.error('Error inserting tag into tags table:', error);
        }
      })
    );

    // Insert into tag_assignment table
    const tagAssignmentResults = await Promise.all(
      req.body.tags.map(async (tag) => {
        try {
          return await db.query(
            "INSERT INTO TAG_ASSIGNMENT (PRODUCT_ID, TAG_NAME) VALUES($1, $2) RETURNING *",
            [ productId, tag]
          );
        } catch (error) {
          console.error('Error inserting tag assignments table:', error);
        }
      })
    );

    res.status(201).json({
      status: "success",
      results: productResults.rows.length,
      data: {
        products: productResults.rows[0]
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});
//delete a product
app.delete("/deleteProduct/:productId/:pid", async (req, res) => {
  try{
    console.log("Got a delete product request");
    const results = await db.query(
      'CALL delete_product_procedure($1, $2)',
      [req.params.productId, req.params.pid]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});
//get all the products of a storefront
app.get("/getStoreProducts/:id", async (req, res) => {
  try{
    console.log("Got get a store products request");
    const rowsPerPage = req.query.rows_per_page || 10; // Default to 10 rows per page if not provided
    const pageNumber = req.query.page_number || 1; // Default to the first page if not provided
    const offset = (pageNumber - 1) * rowsPerPage;
    let x = 0;
    let query = `SELECT P.*, COALESCE(AVG(R.RATING), 0) AS PRODUCT_RATING, ARRAY_AGG(TA.TAG_NAME) AS TAGS FROM PRODUCT P LEFT OUTER JOIN REVIEW R ON(P.PRODUCT_ID = R.PRODUCT_ID) LEFT OUTER JOIN TAG_ASSIGNMENT TA ON (P.PRODUCT_ID = TA.PRODUCT_ID)`;
    if (req.query.search !== undefined && req.query.search !== "") {
      query += ` ${x>0?'AND':'WHERE'} LOWER(P.PRODUCT_NAME) LIKE LOWER('%${req.query.search}%')`;
      x=1;
    }
    if(req.query.tags !== undefined){
      //tags are separated by |
      const tags = req.query.tags.split("|");
      for(let i = 0; i < tags.length; i++){
        query += ` ${x>0?'AND':'WHERE'} P.PRODUCT_ID IN (SELECT PRODUCT_ID FROM TAG_ASSIGNMENT WHERE LOWER(TAG_NAME) = LOWER('${tags[i]}'))`;
        x=1;
      }
    }
    query += ` GROUP BY P.PRODUCT_ID HAVING P.STOREFRONT_ID = ${req.params.id} ORDER BY P.PRODUCT_ID`;
    query1 = query;
    query += ` OFFSET ${offset} LIMIT ${rowsPerPage}`;

    //const query = `SELECT P.*, COALESCE(ROUND(AVG(R.RATING)), 0) AS PRODUCT_RATING, ARRAY_AGG(TA.TAG_NAME) AS TAGS FROM PRODUCT P LEFT OUTER JOIN REVIEW R ON (P.PRODUCT_ID = R.PRODUCT_ID) LEFT OUTER JOIN TAG_ASSIGNMENT TA ON (P.PRODUCT_ID = TA.PRODUCT_ID) WHERE P.STOREFRONT_ID = $1 GROUP BY P.PRODUCT_ID`; 
    const results = await db.query(query);

    const result1 = await db.query(query1);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        products: results.rows,
        totalPages: Math.ceil(result1.rows.length / rowsPerPage)
      }
    });
  }catch(err){
    console.log(err);
  }
});





















//create an announcement 
app.post("/createAnnouncement", async (req, res) => {
  try{
    console.log("Got a create announcement request");
    const results = await db.query(
      "INSERT INTO announcements (PERSON_ID, STOREFRONT_ID, ANNOUNCEMENT_DESCRIPTION, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.body.person_id, req.body.storefront_id, req.body.description, req.body.image]
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
//get total number of announcements
app.get("/getTotalAnnouncements", async (req, res) => {
  try{
    console.log("Got get total announcements request");
    const results = await db.query(
      "SELECT COUNT(*) FROM announcements"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        cnt: results.rows[0]
      }
    });
  }catch(err){
    console.log(err);
  }
});

//get all the announcements, 
app.get("/getAnnouncements", async (req, res) => {
  try {
    const rowsPerPage = req.query.rows_per_page || 10; // Default to 10 rows per page if not provided
    const pageNumber = req.query.page_number || 1; // Default to the first page if not provided
    const offset = (pageNumber - 1) * rowsPerPage;

    const results = await db.query(
      "SELECT a.*, s.storefront_name FROM announcements a join storefront s using(storefront_id) ORDER BY POSTED_ON DESC OFFSET $1 LIMIT $2",
      [offset, rowsPerPage]
    );

    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        announcements: results.rows,
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














//view products in cart
app.get("/getCart/:id", async (req, res) => {
  try {
    console.log("Got view cart request");
    // const results = await db.query(
    //   `SELECT * FROM (${GET_PRODUCT1} WHERE P.PRODUCT_ID IN (SELECT PRODUCT_ID FROM CART WHERE PERSON_ID = ${req.params.id}) ${GET_PRODUCT2}) TEMP JOIN CART C ON (TEMP.PRODUCT_ID = C.PRODUCT_ID)`
    // );
    const results = await db.query (
        `SELECT * FROM PRODUCT P JOIN CART C ON (P.PRODUCT_ID = C.PRODUCT_ID) WHERE C.PERSON_ID = ${req.params.id} ORDER BY C.PRODUCT_ID`
    );
    //console.log(results.rows);
    //console.log(`SELECT * FROM (${GET_PRODUCT1} WHERE P.PRODUCT_ID IN (SELECT PRODUCT_ID FROM CART WHERE PERSON_ID = ${req.params.id}) ${GET_PRODUCT2}) TEMP JOIN CART C ON (TEMP.PRODUCT_ID = C.PRODUCT_ID)`);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        cart: results.rows
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
//get products from cart
app.get("/getCart/:id/:productId", async (req, res) => {
  try {
    console.log("Got view cart request");
    // const results = await db.query(
    //   `SELECT * FROM (${GET_PRODUCT1} WHERE P.PRODUCT_ID IN (SELECT PRODUCT_ID FROM CART WHERE PERSON_ID = ${req.params.id} AND PRODUCT_ID = ${req.params.productId}) ${GET_PRODUCT2}) TEMP JOIN CART C ON (TEMP.PRODUCT_ID = C.PRODUCT_ID)`
    // );
    const results = await db.query (
      `SELECT TEMP.*, COALESCE(C.QUANTITY, 0) AS QUANTITY FROM (SELECT * FROM PRODUCT WHERE PRODUCT_ID = ${req.params.productId}) TEMP LEFT OUTER JOIN CART C ON (TEMP.PRODUCT_ID = C.PRODUCT_ID AND C.PERSON_ID = ${req.params.id})`
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        product: results.rows[0]
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
//adding a product to cart - old version
app.post("/addToCart/:personId/:productId/:quantity", async (req, res) => {
  try{
    console.log("Got a add to cart request");

    const results = await db.query("SELECT add_to_cart_function($1, $2, $3)",
    [req.params.personId, req.params.productId, req.params.quantity]);

    // const results = await db.query(
    //   "INSERT INTO CART (PERSON_ID, PRODUCT_ID, QUANTITY) VALUES ($1, $2, $3) ON CONFLICT (PERSON_ID, PRODUCT_ID) DO UPDATE SET QUANTITY = CART.QUANTITY + EXCLUDED.QUANTITY RETURNING *",
    //   [req.params.personId, req.params.productId, req.params.quantity]
    // );

    if (results){
      res.status(201).json({
        status: "success",
        results: results.rows.length,
        data: {
          stat : true
        }
      });
    }
    else{
      res.status(500).json({
        status: "fail",
        message: "Failed to insert",
        data: {
          stat : false
        }
      });
    }
  }catch(err){
    console.log(err);
  }
});

//adding a product to cart - new version

//clear cart
app.delete("/clearCart/:id", async (req, res) => {
  try{
    console.log("Got a clear cart request");
    const results = await db.query(
      "CALL clear_cart_procedure($1)",
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
app.delete("/removeFromCart/:personId/:productId", async (req, res) => {
  try{
    console.log("Got a remove from cart request");
    const results = await db.query(
      "UPDATE CART SET QUANTITY = QUANTITY - 1 WHERE PERSON_ID = $1 AND PRODUCT_ID = $2",
      [req.params.personId, req.params.productId]
    );
    const res2 = await db.query(
      "UPDATE PRODUCT SET STOCK_COUNT = STOCK_COUNT + 1 WHERE PRODUCT_ID = $1",
      [req.params.productId]
    );
    const res3 = await db.query(
      "DELETE FROM CART WHERE QUANTITY = 0"
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});


//checkout of a person
app.post("/checkout/:id", async (req, res) => {
  try{
    console.log("Got a checkout request");
    //const results = await db.query (
    //  `CALL process_cart_and_transactions(${req.params.id}, ${req.body.payment_method});`
    //)
    const results = await db.query(
      'CALL process_cart_and_transactions($1, $2)',
      [req.params.id, req.body.payment_method]
    );
    
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
      }
    });
  }catch(err){
    console.log(err);
  }
});

//get all the transactions
app.get("/getTransactions", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM TRANSACTIONS");
    res.status(200).json({
      status: "success",
      data: {
        transactions: results.rows
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//get all the actions
app.get("/getActions", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM ACTION_LOG");
    res.status(200).json({
      status: "success",
      data: {
        actions: results.rows
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//get all the functions
app.get("/getFunctions", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM PLSQL_LOG WHERE function_name != 'is_manager_of_product' AND function_name != 'is_manager_of_storefront'");
    res.status(200).json({
      status: "success",
      data: {
        functions: results.rows
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//get all the transactions for id
app.get("/getTransactions/:id", async (req, res) => {
  try{
    console.log("Got get all transactions request");
    //const results = await db.query(`SELECT * FROM TRANSACTIONS JOIN storefront USING(STOREFRONT_ID) WHERE PERSON_ID = ${req.params.id}`);
    const results = await db.query(`SELECT *, IS_MANAGER_OF_STOREFRONT(${req.params.id}, STOREFRONT_ID) AS STATUS FROM TRANSACTIONS JOIN storefront USING(STOREFRONT_ID) WHERE PERSON_ID = ${req.params.id} OR IS_MANAGER_OF_STOREFRONT(${req.params.id}, STOREFRONT_ID) = 1`);
    
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        transactions: results.rows
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
//get details of a specific order GROUP 
app.get("/getGroupOrder/:id", async (req, res) => {
  try{
    console.log("Got get a order request");
    const results = await db.query(`SELECT ORDER_ID, PRODUCT_NAME, QUANTITY, PERSON_ID, TRANSACTION_ID, ORDER_TIME, DELIVERY_STATUS, P.PRICE FROM ORDERS O JOIN PRODUCT P USING(PRODUCT_ID) WHERE GROUP_ID = ${req.params.id} UNION SELECT ORDER_ID, PRODUCT_NAME, QUANTITY, PERSON_ID, TRANSACTION_ID, ORDER_TIME, DELIVERY_STATUS, P.PRICE FROM ORDERS O JOIN DELETED_PRODUCT P USING(PRODUCT_ID) WHERE GROUP_ID = ${req.params.id}`);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        orders: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
//get details of a specific order group when the second parameter is the shopkeepr id
app.get("/getGroupOrder/:id/:shopkeeperId", async (req, res) => {
  try{
    console.log("Got get a order request");
    const results = await db.query(`SELECT ORDER_ID, PRODUCT_NAME, QUANTITY, PERSON_ID, TRANSACTION_ID, ORDER_TIME, DELIVERY_STATUS, P.PRICE FROM ORDERS O JOIN PRODUCT P USING(PRODUCT_ID) WHERE GROUP_ID = ${req.params.id} AND STOREFRONT_ID IN (SELECT STOREFRONT_ID FROM MANAGES WHERE PERSON_ID = ${req.params.shopkeeperId})`);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        orders: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});
// change the delivery status of a specific order group when the second parameter is the shopkeeper id
app.put("/changeDeliveryStatus/:id/:shopkeeperId", async (req, res) => {
  try{
    console.log("Got a change delivery status request");
    const results = await db.query(`UPDATE ORDERS SET DELIVERY_STATUS = $1 WHERE GROUP_ID = $2 AND IS_MANAGER_OF_PRODUCT($3, PRODUCT_ID) = 1;`, [req.body.delivery_status, req.params.id, req.params.shopkeeperId]);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        orders: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});

//get all the order groups of a person
app.post("/getGroupOrders/:id", async (req, res) => {
  try{
    console.log("Got get all orders request");
    let results = "";

    if(req.body.order_type == "incoming"){
      if(req.body.delivery_status != 3) {
        results = await db.query(`
        SELECT GROUP_ID, MIN(DELIVERY_STATUS) AS DELIVERY_STATUS, MIN(ORDER_TIME) AS ORDER_TIME FROM ORDERS WHERE PERSON_ID = ${req.params.id} AND DELIVERY_STATUS = ${req.body.delivery_status} GROUP BY GROUP_ID;`);
      }
      else {
        results = await db.query(`
        SELECT GROUP_ID, MIN(DELIVERY_STATUS) AS DELIVERY_STATUS, MIN(ORDER_TIME) AS ORDER_TIME FROM ORDERS WHERE PERSON_ID = ${req.params.id} GROUP BY GROUP_ID;`);
      }
    }
    else {
      if(req.body.delivery_status != 3) {
        results = await db.query(`SELECT GROUP_ID, MIN(DELIVERY_STATUS) AS DELIVERY_STATUS, MIN(ORDER_TIME) AS order_time FROM ORDERS O JOIN PRODUCT P USING (PRODUCT_ID) JOIN MANAGES USING(STOREFRONT_ID) WHERE MANAGES.PERSON_ID = ${req.params.id} AND DELIVERY_STATUS = ${req.body.delivery_status} GROUP BY GROUP_ID;`);
      }
      else {
        results = await db.query(`SELECT GROUP_ID, MIN(DELIVERY_STATUS) AS DELIVERY_STATUS, MIN(ORDER_TIME) AS order_time FROM ORDERS O JOIN PRODUCT P USING (PRODUCT_ID) JOIN MANAGES USING(STOREFRONT_ID) WHERE MANAGES.PERSON_ID = ${req.params.id} GROUP BY GROUP_ID;`);
      }
    }
    //const results = await db.query("SELECT * FROM ORDERS WHERE PERSON_ID = $1", [req.params.id]);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        groups: results.rows
      }
    });
  }catch(err){
    console.log(err);
  }
});

//leaving a review of a product by a person
app.post("/postReview/:productId/:personId", async (req, res) => {
  try {
    console.log("Got a post review request");
    // const results = await db.query(
    //   "INSERT INTO review (product_id, person_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    //   [req.params.productId, req.params.personId, req.body.rating, req.body.comment]
    // );

    const check = await db.query("SELECT * FROM REVIEW WHERE PERSON_ID = $1 AND PRODUCT_ID = $2", [req.params.personId, req.params.productId]);

    console.log(check);

    if (check.rows.length !== 0) {
      const results = await db.query(
        "UPDATE REVIEW SET COMMENTS = $1, RATING = $2 WHERE PERSON_ID = $3 AND PRODUCT_ID = $4",
        [req.body.comment, req.body.rating, req.params.personId, req.params.productId]
      );
      
      res.status(201).json({
        status: "success",
        results: results.rows.length,
        data: {
          review: results.rows[0]
        }
      });
    }
    else{
      const results = await db.query(
        "INSERT INTO REVIEW (PRODUCT_ID, PERSON_ID, COMMENTS, RATING) VALUES ($1, $2, $3, $4)",
        [req.params.productId, req.params.personId, req.body.comment, req.body.rating]
      );

      res.status(201).json({
        status: "success",
        results: results.rows.length,
        data: {
          review: results.rows[0]
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});
//getting all the reviews of a product
app.get("/getReviews/:productId", async (req, res) => {
  try {
    console.log("Got get all reviews request");
    const results = await db.query(
      `SELECT * FROM REVIEW WHERE PRODUCT_ID = ${req.params.productId}`
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        reviews: results.rows
      }
    });
  } catch (err) {
    console.log(err);
  }
});


//getting all existing tags which has a similar prefix
app.get("/getTags/", async (req, res) => {
  try {
    console.log("Got get all tags request");
    const results = await db.query(
      `SELECT * FROM TAGS`
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        tags: results.rows
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//posting complaint
app.post("/submitComplaint/", async (req, res) => {
  try {
    console.log("Got a post complaint request");
    const results = await db.query(
      "INSERT INTO COMPLAINTS (PERSON_ID, STOREFRONT_ID, COMPLAINT_DETAILS) VALUES ($1, $2, $3) RETURNING *",
      [req.body.personId, req.body.storeId, req.body.complaintDetails]
    );
    res.status(201).json({
      status: "success",
      results: results.rows.length,
      data: {
        complaint: results.rows[0]
      }
    });
  } catch (err) {
    console.log(err);
  }
});






//get locations
app.get("/getLocations", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM LOCATION");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        locations: results.rows,
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//delete a person
app.delete("/deletePerson/:pid", async (req, res) => {
  try{
    console.log("Got a delete person request");
    const results = await db.query(
      'CALL delete_person_procedure($1)',
      [req.params.pid]
    );
    res.status(204).json({
      status: "success"
    });
  }catch(err){
    console.log(err);
  }
});


// //Create a person
// app.post("/createPeople", async (req, res) => {
//   try{
//     console.log("Got a create person request");
//     const results = await db.query(
//       "INSERT INTO test (id, name) VALUES ($1, $2) RETURNING *",
//       [req.body.id, req.body.description]
//     );
//     res.status(201).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         people: results.rows[0]
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });

// //Update a person
// app.put("/updatePeople/:id", async (req, res) => {
//   try{
//     console.log("Got an update person request");
//     const results = await db.query(
//       "UPDATE test SET name = $2 WHERE id = $1 RETURNING *",
//       [req.params.id, req.body.name]
//     );
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         people: results.rows[0]
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });

// //Delete a person
// app.delete("/deletePeople/:id", async (req, res) => {
//   try{
//     console.log("Got a delete person request");
//     const results = await db.query(
//       "DELETE FROM test where id = $1",
//       [req.params.id]
//     );
//     res.status(204).json({
//       status: "success"
//     });
//   }catch(err){
//     console.log(err);
//   }
// });
// //Get all people
// app.get("/getPeople", async (req, res) => {
//   try{
//     console.log("Got get all people request");
//     const results = await db.query("SELECT * FROM test");
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         people: results.rows
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });
// //Get a person
// app.get("/getPeople/:id", async (req, res) => {
//   try{
//     console.log("Got get a person request");
//     const results = await db.query(
//       "SELECT * FROM test WHERE id = $1", [req.params.id]
//     );
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         people: results.rows[0]
//       }
//     });
//   }catch(err){
//     console.log(err);
//   }
// });