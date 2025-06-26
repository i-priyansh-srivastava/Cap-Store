const express = require('express')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

require("dotenv").config();

const dbConnect = require('./Configs/database.js');
dbConnect();
const PORT = process.env.PORT || 5000;

const routeMount = require('./Routes/routes.js')
app.use('/api/v1', routeMount)

app.get('/', (req, res) => {
    res.send("Backend started");
})

app.listen(PORT, () => {
    console.log(`Server instantiated on Port: ${PORT}`);
})

