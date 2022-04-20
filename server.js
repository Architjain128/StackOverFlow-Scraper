const fs = require('fs');
const { parse } = require("json2csv");
const writeStream = fs.createWriteStream("stackOverflowData.csv");
const StackOverflowScraper = require('./stackOverflowScraper.js');




// setting up connection with database
if(process.env.DB_URI){
    const db = require('./database')
    const DataSchema = require('./schema')
    db.once('open', () => console.log("connected to db"))
    db.on('error', () => console.error('oops cannot connect to db'))
}

// exit handler executed when process is killed
async function exitHandler(options, exitCode) {
    if (exitCode || exitCode === 0) {
        console.log("EXIT")
        const finalData = await Scraper.getData();
        if(finalData && finalData.length){
            const csv = parse(finalData);

            // writing to csv
            writeStream.write(csv);
            
            if(process.env.DB_URI){
                // writing to database
                await DataSchema.insertMany(finalData).then(() => {
                    console.log("saved to db");
                },(error) => {
                    console.log(error);
                })
            }
        }
    }
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null, {exit:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


// initialize scraper
const Scraper = new StackOverflowScraper({concurrencyCount:5,urlPerPage:15,maxPage:5});
Scraper.run();