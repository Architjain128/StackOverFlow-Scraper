# How to run
+ Install dependencies
```
    > npm install
```
+ Add `DB_URI` to `.env`
```
 DB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db_name>?retryWrites=true&w=majority"
```
+ Run the app
```
    > npm start  OR  node server.js 
```
+ Parameter
    + `concurrencyCount` : number of concurrency requests | `Default:5`
    + `urlPerPage` : number of question on homepage | `Default:15`
    + `maxPage` : number of pages to be scraped in pagination | `Default:5`

# File structure
+ `server.js` : main file containing driver code
+ `stackOverflowScraper.js` : contains all the code for the scrapping process
+ `database.js` : contains all the code for building the database connection
+ `schema.js` : contains information about the database schema

# Outputs
+ `stackOverflow.csv` : contains the scraped data in csv format
+ add `DB_URI` to .env file to connect to the database MongoDB Atlas

# Database
+ Used MongoDB Atlas for storing the data
+ Schema
    ```
    const Data = new mongoose.Schema({
        title: { type: String },
        url: { type: String },
        votes: { type: Number },
        answer: { type: Number },
        frequency: { type: Number },
    });

    ```

# Node Version
+ Use Node version more than or equal to v12.x
+ Want to upgrade the version?
```
  > sudo curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  > sudo apt-get install -y nodejs
```