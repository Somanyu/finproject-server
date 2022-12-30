const express = require("express");
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './.env' });

const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).json({name: "Somanyu Samal", message: "This is API res from /"})
})

app.listen(PORT, () => {
    console.log(`App listening on at http://localhost:${PORT}`);
})