import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


import { users } from './routes/users.js';
import { customer } from './routes/customers.js';


// configuring the environment
dotenv.config();
const PORT = process.env.PORT || 3001;
const MONGODB = process.env.MONGODB;


mongoose.connect(MONGODB, () => {
    console.log("Database Connected");
})

//creating application server
const app = express();


//applying middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// registering routers
app.use("/users", users);
app.use("/customers", customer);

app.use((req, res, next) => {
    res.status(404).json({
        message: "url not found"
    })
})



//running the application server
app.listen(PORT, () => {
    console.log(`Application Running on ${PORT}`);
});