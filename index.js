const express = require('express')
const connectDB = require('./dp/connect')
require('dotenv').config()
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')
const authRouter = require('./router/user')
const tourRouter = require('./router/tour')

const port = 3000;

const app = express()

app.use(morgan('dev'))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/users', authRouter)
app.use('/tour', tourRouter)



mongoose.set("strictQuery", false);

const start =  async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})
    } catch (error) {
        console.log(error);
    }

 
} 

start();