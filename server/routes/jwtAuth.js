const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//register route

router.post("/register", validInfo, async (req, res) => {
    try {
        //1. destructure the req.body (name, password, dob, phone, email)

        const { name, password, dob, phone, email, image } = req.body;

        //2. check credentials for duplicacy or invalid phone number length

        const flag = await db.query("SELECT check_credentials_function($1, $2)", [phone, email]);

        if (!flag) {
            return res.status(401).json("Invalid credentials");
        }

        //3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the new user inside our database
        const newUser = await db.query("INSERT INTO person (person_name, password, date_of_birth, phone, email, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, bcryptPassword, dob, phone, email, image]);

        //5. generating jwt token
        const token = jwtGenerator(newUser.rows[0].person_id);

        res.json({ token });
        console.log("Succesful Registration");

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }

});

//login route

router.post("/login", validInfo, async (req, res) => {
    try {
        
        //1. destructure the req.body

        const { email, password } = req.body;

        //2. check if user doesn't exist, throw error if not

        const user = await db.query("SELECT * FROM person WHERE email = $1",
        [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        //3. check if incoming password matches

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        
        if (!validPassword){
            return res.status(401).json("Password or Email is incorrect");
        }

        //4. give them the jwt token

        const token = jwtGenerator(user.rows[0].person_id);
        res.json({ token });
        console.log("Succesful Login");

    } catch (error) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

//verify route

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;