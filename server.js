const db = require('./database')
const DataSchema = require('./schema')
db.once('open', () => console.log("connected to db"))
db.on('error', () => console.error('oops cannot connect to db'))
