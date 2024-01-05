const { Pool } = require('pg');
 
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'pfm',
    password: 'abcd',
    port: 5432
});
 
//export const query = (text, params) => pool.query(text, params);
module.exports = {
    query: (text, params) => pool.query(text, params)
};