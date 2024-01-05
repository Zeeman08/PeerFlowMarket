const express = require("express");
const app = express();

app.get("/getNiggers", (req, res) => {
    console.log("get all the niggers");
})


const port = 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});