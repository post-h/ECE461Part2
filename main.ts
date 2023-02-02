// compile with: tsc main.ts
// execute with: node ./main.js
// if there is an error: "cannot find the name 'process'", run: 'npm i --save-dev @types/node'
import { Module } from "./Module";
import { Metric } from "./Metric";
import { RampUp } from "./RampUp";
import { Correctness } from "./Correctness";
import { BusFactor } from "./BusFactor";
import { Responsiveness } from "./Responsiveness";
import { Licensing } from "./Licensing"

// example: array of URLs --> assuming we read in the input file as strings
let urlArray : string[] = [ "www.mockurl1.com", "www.pretendurl.com", "www.testingurl.com" ];
let moduleArray : Module[] = [];

// get command line flags
const argv = process.argv.slice(2)

let flag = argv[0];

if (argv.length != 1)
{
    // if no flags, need one
    console.log("Need a command line argument. Options are:\n\
    'install'   - installs any dependencies\n\
    'build'     - completes all compilation needed\n\
    'URL_FILE'  - takes in file containing URLs and calculates the scores\n\
    'test'      - conducts at least 20 distinct test cases");

    // exits with 1
    process.exit(1);
}
else if (flag == "install")
{
    // install dependencies needed
    // '@types/node' ?

    console.log("Installing...");

    // exits with 0
    console.log("Exiting...");
    process.exit(0);
}
else if (flag == "build")
{
    // completes any compilation needed
    
    console.log("Building...");

    // exits with 0
    console.log("Exiting...");
    process.exit(0);
}
else if (flag == "test")
{
    // runs at least 20 distinct test cases

    console.log("Testing...");

    // exits with 0
    console.log("Exiting...");
    process.exit(0);
}
else 
{
    // URL_FILE

    console.log("URL_FILE...");

    // exits with 0
    console.log("Exiting...");
    process.exit(0);
}

/*
// then we create an array of Module objects with the urls
for (var url in urlArray)
{
    moduleArray.push(new Module(url));
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

}
*/