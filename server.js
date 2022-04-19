const db = require('./database')
const DataSchema = require('./schema')
db.once('open', () => console.log("connected to db"))
db.on('error', () => console.error('oops cannot connect to db'))

const StackOverflowScraper = require('./stackOverflowScraper.js');
const Scraper = new StackOverflowScraper({concurrencyCount:5,urlPerPage:15,maxPage:5});
Scraper.run();