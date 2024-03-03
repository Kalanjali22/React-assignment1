const express = require('express')
const { Pool } = require('pg')
const app = express()
const cors = require('cors');
const port = 8080

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});
app.use(cors());
app.use(express.json());

app.get('/customers', async (req, res) => {
    try {
        const query = 'SELECT * FROM react_db;';
        const { rows } = await pool.query(query);
        return res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})