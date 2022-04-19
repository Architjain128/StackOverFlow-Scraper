const { default: axios } = require("axios");
const cheerio = require("cheerio");

class StackOverflowScraper{
    constructor(params){
        const {urlPerPage, concurrencyCount,maxPage} = params;
        this.urlPerPage = urlPerPage;
        this.maxPage = maxPage
        this.concurrencyCount = concurrencyCount;
        this.urls = [];
        this.results = [];
        this.frequency = new Map();
        this.urlCtr=0;
    }
    sleep(delay) {
        return new Promise(resolve=>setTimeout(()=>resolve(1), delay));
    }
    listUrlsPerPage(){
        for(let i = 1;i<=this.maxPage;i++){
            this.urls.push(`https://stackoverflow.com/questions?tab=newest&pagesize=${this.urlPerPage}&page=${i}`);
        }
    }
    randomValue(minVal,maxVal){
        return Math.floor(Math.random()*(maxVal-minVal)+minVal);
    }
    updateRelatedFrequency(urlArray){
        urlArray.forEach(({ title, url }) => {
            const freq = this.frequency.get(title);
            if(freq){
                this.frequency.set(title, freq + 1);
            } else{
                this.frequency.set(title, 1);
                this.urls.push(url);
            }
        });
    }
    async extractData(){
        try{
            if (this.urls.length === this.urlCtr) {
                return;
            }
            const url = this.urls[this.urlCtr];
            this.urlCtr++;
            if(/questions\/\d*/.test(url)){
                console.log(`Fetching ${url}`);
                const response = await axios.get(url)
                if(response){
                    const $ = cheerio.load(response.data);
                    const title = $('#question-header > .fs-headline1').eq(0).text();
                    const votes = $('.js-vote-count').eq(0).attr("data-value");
                    const answer = $(".answers-subheader h2").text().replace(/\D/g, '');
                    const relations = $(".sidebar-related > .related").children();
                    const relationArray = [];
                    relations.each((i, el) => {
                        let related = {};
                        let url = $(el).find("a").eq(1).attr("href");
                        related.url = `https://stackoverflow.com${url}`;
                        related.title = $(el).find("a").eq(1).text();
                        relationArray.push(related);
                    });
                    this.updateRelatedFrequency(relationArray);
                    const result = {
                        title,
                        url,
                        votes,
                        answer
                    };
                    this.results.push(result);
                }
            }
            else{
                console.log(`Fetching ${url}`);
                const response = await axios.get(url);
                if (response) {
                    const $ = cheerio.load(response.data);
                    const questions = $("#questions");
                    const questionArray = [];
                    questions.each((i, el) => {
                        let question = {};
                        let url = $(el).find("a").eq(0).attr("href");
                        question.url = `https://stackoverflow.com${url}`;
                        question.title = $(el).find("a").eq(0).text();
                        questionArray.push(question);
                    });
                    this.updateRelatedFrequency(questionArray);
                }
            }
            await this.sleep(this.randomValue(500,1000));
            this.extractData();
        }
        catch(error){
            console.log(error);
        }
    }
    async getData(){
        const finalData = [];
        this.results.forEach(item => {
            const { title } = item;;
            finalData.push({ ...item, frequency: this.frequency.get(title)});
        });
        return finalData;
    }
    async run(){
        this.listUrlsPerPage();
        for(let i = 0;i<this.concurrencyCount;i++){
            this.extractData();
        }
    }
}
module.exports = StackOverflowScraper;