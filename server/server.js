const express = require("express");
const app = express();
//middleware
app.use(express.json());
app.get("/getPeople", (req, res) => {
    //console.log("get all the people");
    res.json({
        status: "success",
        data: {
            people: ["gawwy", "rubaiyat"]
        }
    })
})
//get a person
app.get("/getPeople/:id", (req,res) => {
    console.log(req.params);
    res.status(201).json({
        status: "success",
        data: {
            person: req.params.id
        }
    })
});
//create a person
app.post("/createPeople", (req,res) => {
    console.log(req.body);
});
//update a person
app.put("/updatePeople/:id", (req,res) => {
    console.log(req.params.id);
    console.log(req.body);
    res.status(201).json({
        status: "success",
        data: {
            person: req.params.id
        }
    })
});

//delete a person
app.delete("/deletePeople/:id", (req,res) => {
    console.log("delete people");
    console.log(req.params.id);
    res.status(201).json({
        status: "success",
        data: {
            person: req.params.id
        }
    });
}   );

console.log("test");
const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});