// compile with: tsc main.ts
// execute with: node ./main.js
// if there is an error: "cannot find the name 'process'", run: 'npm i --save-dev @types/node'
import * as fs from 'fs';

import { Module } from "./Module";
import { Metric } from "./Metric";
import { RampUp } from "./RampUp";
import { Correctness } from "./Correctness";
import { BusFactor } from "./BusFactor";
import { Responsiveness } from "./Responsiveness";
import { Licensing } from "./Licensing"
import { exit } from "process";
import { fileURLToPath } from 'url';

// example: array of URLs --> assuming we read in the input file as strings
let urlArray : string[] = [ "www.mockurl1.com", "www.pretendurl.com", "www.testingurl.com" ];
let moduleArray : Module[] = [];

// get command line flags
const argv = process.argv.slice(2)

let flag = argv[0];

console.log(urlArray);

// how to read file in as array
//const urlFile = fs.readFileSync('./sample_url.txt', 'utf-8');   // tested using sample url file
const urlFile = fs.readFileSync(flag, 'utf-8');                 // this uses the flag passed through in 'run' for the destination of the file    
urlArray = urlFile.split('\n');
console.log(urlArray);

// then we create an array of Module objects with the urls
for (var url in urlArray)
{
    moduleArray.push(new Module(urlArray[url]));
    console.log(urlArray[url]);
}

// then for each module, we go through calculating each score
for (var module in moduleArray)
{
    moduleArray[module].calcRampUpScore();
    moduleArray[module].calcCorrectnessScore();
    moduleArray[module].calcBusFactorScore();
    moduleArray[module].calcResponsivenessScore();
    moduleArray[module].calcLicensingScore();

    moduleArray[module].calcNetScore();
    console.log(moduleArray[module].netScore);
}
