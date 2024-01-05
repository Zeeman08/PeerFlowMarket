const express = require("express");
const app = express();

app.use(express.json());

//Get all people
app.get("/getPeople", (req, res) => {
  console.log("Got all people")
  res.status(200).json({
    status: "success",
    data: {
      people: ["Gawwy", "Rubaiyat"]
    }
  });
});

//Get a person
app.get("/getPeople/:id", (req, res) => {
  console.log("Got a person")
  res.status(200).json({
    status: "success",
    data: {
      people: "Gawwy"
    }
  });
});

//Create a person
app.post("/createPeople", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: "success"
  });
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

const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});