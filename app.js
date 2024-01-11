const express = require('express');
const morgan = require('morgan');
require('express-async-errors')
const {errorHandler} = require('./middlewares/error')
const cors = require('cors')

require("dotenv").config();
require('./db');

const userRouter = require('./routes/user');
const { hadleNotFound } = require('./utils/helper');

const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));
app.use('/api/user', userRouter);
app.use('/*',hadleNotFound);


app.use(errorHandler);

app.listen(8000, () => {
    console.log("The port is listening on port 8000");
})