require('dotenv').config()
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose
    .connect(uri, {useNewUrlParser : true , useUnifiedTopology : true})
    .catch(e=>{
        console.error('connection error', e.message)
    })
const db = mongoose.connection
module.exports = db