if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require('cors')
const logger = require('./config/logger')
const moviesRouter = require('./movies/movies.router')
const theatersRouter = require('./theaters/theaters.router')
const app = express();

app.use(cors())
app.use(logger)
app.use(express.json())

app.use('/movies', moviesRouter)
app.use("/theaters", theatersRouter);

//Not Found Handler
app.use((req,res,next)=>{
     next({status: 404, message: `Not found ${req.originalUrl}`})
})

//Error handler
app.use((err, req,res,next)=>{
     console.error(err)
     const {status = 500, message = 'Something went wrong!'} = err
     res.status(status).json({error: message})
})

module.exports = app;
