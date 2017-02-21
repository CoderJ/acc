global.__base = __dirname + '/'
var mongodb = require(__base + 'modules/db');
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf(),
    nounInflector = new natural.NounInflector();
    var countInflector = natural.CountInflector;
    var verbInflector = new natural.PresentVerbInflector();
var fs = require("fs");
var amazonCrawler = require(__base + 'modules/amazonCrawler');
var stopWords = fs.readFileSync(__base + '/data/stop_words', 'utf-8');
stopWords = stopWords.split("\n");

/*// Analyze the data
var data = tfidf.analyze("japherwocky", [doc1, doc2, doc3], stopWords);

// Get tfidf for a document
console.log(data.tfidf(doc1));

// Get the analyzed corpus as JSON, for later use
fs.writeFileSync("japherwockyFrequency.json", data.asJSON());

// Load the analyzed corpus again, later
var data = tfidf.analyze(fs.readFileSync("japherwockyFrequency.json", "utf8"));*/