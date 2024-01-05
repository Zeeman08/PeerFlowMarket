const express = require("express");
const app = express();
const db = require("./db");

//Insert middleware here omar

app.use(express.json());

//Get all people
app.get("/getPeople", async (req, res) => {
  try{
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

//Create a person
app.post("/createPeople", async (req, res) => {
  try{
    const results = await db.query(
      "INSERT INTO test (id, name) VALUES ($1, $2) RETURNING *",
      [req.body.id, req.body.name]
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
app.put("/updatePeople/:id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.status(200).json({
    status: "success"
  });
});

//Delete a person
app.delete("/deletePeople/:id", (req, res) => {
  console.log("Deleting successful");
  console.log(req.params);
  res.status(204).json({
    status: "success"
  });
});

console.log("test");
const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});