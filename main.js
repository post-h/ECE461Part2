"use strict";
exports.__esModule = true;
// compile with: tsc main.ts
// execute with: node ./main.js
var minimist = require("minimist");
var Module_1 = require("./Module");
// example: array of URLs --> assuming we read in the input file as strings
var urlArray = ["www.mockurl1.com", "www.pretendurl.com", "www.testingurl.com"];
var moduleArray = [];
// then we create an array of Module objects with the urls
for (var url in urlArray) {
    moduleArray.push(new Module_1.Module(url));
    console.log(urlArray[url]);
}
// then for each module, we go through calculating each score
for (var module in moduleArray) {
    moduleArray[module].calcRampUpScore();
    moduleArray[module].calcCorrectnessScore();
    moduleArray[module].calcBusFactorScore();
    moduleArray[module].calcResponsivenessScore();
    moduleArray[module].calcLicensingScore();
}
var message = "Hello, world!";
console.log(message);
var argv = minimist(process.argv.slice(1));
console.log("TEST");
console.log(argv);
