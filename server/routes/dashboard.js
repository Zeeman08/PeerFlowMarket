const router = require("express").Router();
const db = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        
        //req.person has the payload
        //res.json(req.person);

        const person = await db.query("SELECT * FROM person WHERE person_id = $1",
        [req.person]);

        res.json(person.rows[0]);

    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;