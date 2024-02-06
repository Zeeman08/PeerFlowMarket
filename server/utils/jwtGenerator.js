const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(person_id) {
    const payload = {
        person: person_id
    };

    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;