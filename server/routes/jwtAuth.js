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

        const { name, password, dob, phone, email, image, location, street, houseNumber, postCode } = req.body;

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

        const newAddress = await db.query("INSERT INTO address (person_id, location_id, street_name, house_number, post_code) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [newUser.rows[0].person_id, location, street, houseNumber, postCode]);

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

//update route

router.put("/update/:id", validInfo, async (req, res) => {
    try {
        //1. destructure the req.body (name, password, dob, phone, email)

        const { name, password, dob, phone, email, image, location, street, houseNumber, postCode } = req.body;

        //2. check credentials for duplicacy or invalid phone number length

        const flag = await db.query("SELECT check_credentials_function($1, $2)", [phone, email]);

        if (!flag) {
            return res.status(401).json("Invalid credentials");
        }

        //3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. update data
        const response = await db.query("UPDATE person SET person_name = $1, password = $2, date_of_birth = $3, phone = $4, email = $5, image = $6 WHERE person_id = $7 RETURNING *",
        [name, bcryptPassword, dob, phone, email, image, req.params.id]);

        const response2 = await db.query("UPDATE address SET location_id = $1, street_name = $2, house_number = $3, post_code = $4 WHERE person_id = $5 RETURNING *",
        [location, street, houseNumber, postCode, req.params.id]);

        //5. log it in action log
        const response3 = await db.query("INSERT INTO action_log (PERSON_ID, ACTION_TYPE) VALUES ($1, $2) RETURNING *",
        [req.params.id, 'UPDATE']);

        res.status(201).json({
            status: "success",
        });

        console.log("Succesful Update");        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;