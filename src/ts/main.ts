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
import { Adherence } from './Adherence';
import { VersionPinning } from './VersionPinning';
import { exit } from "process";
import { fileURLToPath } from 'url';
import * as sqlite3 from "sqlite3";
import { version } from 'os';

const db = new sqlite3.Database('./data/modules.db')

// example: array of URLs --> assuming we read in the input file as strings
//let urlArray : string[] = [ "www.mockurl1.com", "www.pretendurl.com", "www.testingurl.com" ];
let urlArray : string[];
let initialURLArray : string[] = [ "" ];
let moduleArray : Module[] = [];

// get command line flags
const argv = process.argv.slice(2)

let convertedURLs = argv[0];
let initialURLs = argv[1];

// how to read file in as array
//const urlFile = fs.readFileSync('./sample_url.txt', 'utf-8');   // tested using sample url file
const convertedURLFile = fs.readFileSync(convertedURLs, 'utf-8');                 // this uses the flag passed through in 'run' for the destination of the file    
urlArray = convertedURLFile.split('\n');

const initialURLFile = fs.readFileSync(initialURLs, 'utf-8');
initialURLArray = initialURLFile.split('\n');

urlArray.pop();

// then we create an array of Module objects with the urls
for (var url in urlArray)
{
    moduleArray.push(new Module(urlArray[url]));
    //console.log(urlArray[url]);
}

async function calcScores(curModule : Module) {
    await curModule.calcBusFactorScore();
    await curModule.calcResponsivenessScore();
    await curModule.calcLicensingScore();
    await curModule.calcCorrectnessScore();
    await curModule.calcAdherenceScore();
    await curModule.calcVersionPinningScore();

    const data = {
        name: curModule.repo,
        rampUp : curModule.rampUp,
        correctness : curModule.correctness,
        busFactor : curModule.busFactor,
        responsiveness : curModule.responsiveness,
        licensing : curModule.licensing,
        adherence : curModule.adherence,
        versionPinning : curModule.versionPinning,
    };
    
    // const sql = 'INSERT INTO ratings (ID, BusFactor, Correctness, RampUp, LicenseScore, GoodPinning, PullRequest, NetScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    // db.run(sql, [curModule.repo, curModule.busFactor.score, curModule.correctness.score,
    //     curModule.rampUp.score, curModule.licensing.score, curModule.versionPinning.score, curModule.adherence.score, curModule.netScore], function(err) {
    //         if (err) {
    //             console.error(err.message);
    //           } else {
    //             console.log(`Inserted row with id ${this.lastID}`);
    //           }
    //     });

    // const sql2 = 'INSERT INTO modules (Name, Version, ID, url) VALUES (?, ?, ?, ?)';
    // let repo_name = (curModule.repo).charAt(0).toUpperCase() + curModule.repo.slice(1);
    // db.run(sql2, [repo_name, 0, curModule.repo, curModule.url]) // NEED to put in the version number

    // db.close()
}

// then for each module, we go through calculating each score
// for (var module in moduleArray)
// {
//     moduleArray[module].calcRampUpScore();
//     //moduleArray[module].calcCorrectnessScore();
//     // moduleArray[module].calcBusFactorScore();
//     // moduleArray[module].calcResponsivenessScore();
//     // moduleArray[module].calcLicensingScore();

//     calcScores(moduleArray[module]);

//     moduleArray[module].calcNetScore();
//     // console.log(moduleArray[module].netScore);
// }

async function ingestibility() {
    for (var module in moduleArray)
    {
        await moduleArray[module].calcRampUpScore();
        await moduleArray[module].calcCorrectnessScore();
        await moduleArray[module].calcBusFactorScore();
        await moduleArray[module].calcResponsivenessScore();
        await moduleArray[module].calcLicensingScore();
        await moduleArray[module].calcAdherenceScore();
        await moduleArray[module].calcVersionPinningScore();
        await moduleArray[module].calcVersion();

        // calcScores(moduleArray[module]);

        await moduleArray[module].calcNetScore();
        // console.log(moduleArray[module].netScore);
    }

    for (let i = 0; i < moduleArray.length; i++) {
        for(let j = 0; j < moduleArray.length - i - 1; j++) {
            if(moduleArray[j].netScore < moduleArray[j + 1].netScore) {
                [moduleArray[j],moduleArray[j+1]] = [moduleArray[j+1],moduleArray[j]];
                [initialURLArray[j],initialURLArray[j+1]] = [initialURLArray[j+1],initialURLArray[j]];
            }
        }
    }

    for (var module in moduleArray) {
        console.log("{\"URL\":\"%s\", \"NET_SCORE\":%s, \"RAMP_UP_SCORE\":%s, \"CORRECTNESS_SCORE\":%s, \"BUS_FACTOR\":%s, \"RESPONSIVE_MAINTAINER_SCORE\":%s, \"LICENSE_SCORE\":%s, \"ADHERENCE_SCORE\":%s, \"VERSION_PINNING_SCORE\":%s}", initialURLArray[module], moduleArray[module].netScore.toFixed(2), moduleArray[module].rampUp.score.toFixed(2), moduleArray[module].correctness.score.toFixed(2), moduleArray[module].busFactor.score.toFixed(2), moduleArray[module].responsiveness.score.toFixed(2), moduleArray[module].licensing.score.toFixed(2), moduleArray[module].adherence.score.toFixed(2), moduleArray[module].versionPinning.score.toFixed(2)); 
    }
    
    // newly added code (i'm not sure if it will be cleaner if we add it in GatherData.ts tho still a little confused)
    // to be tested
    for (var module in moduleArray) {
        // add correctness
        if((moduleArray[module].rampUp.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if ((moduleArray[module].correctness.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if((moduleArray[module].busFactor.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if((moduleArray[module].responsiveness.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if((moduleArray[module].licensing.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if((moduleArray[module].adherence.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        } else if((moduleArray[module].versionPinning.score.toFixed(2) as unknown as number) < 0.5) {
            moduleArray[module].ingestible = -1;
        }
        else {
            moduleArray[module].ingestible = -1;
        }
    }
    
    // end code
    
    // Printing out individual metric score aka extracting them
    // for (var module in moduleArray) {
    //     console.log("Ramp Up Score: %s", moduleArray[module].rampUpScore.toFixed(2));
    //     console.log("Correctness Score: %s", moduleArray[module].correctness.score.toFixed(2)); 
    //     console.log("Bus Factor Score: %s", moduleArray[module].busFactor.score.toFixed(2));
    //     console.log("Responsiveness Score: %s", moduleArray[module].responsiveness.score.toFixed(2));
    //     console.log("Licensing Score: %s", moduleArray[module].licensing.score.toFixed(2));
    //     console.log("Ingestible for use: %s", ingestible);
    // }

    const outputFile = 'outputIngestible.txt';

    for (var module in moduleArray) {
        const sql = 'INSERT INTO ratings (ID, BusFactor, Correctness, RampUp, ResponsiveMaintainer, LicenseScore, GoodPinningPractice, PullRequest, NetScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [moduleArray[module].repo, moduleArray[module].busFactor.score, moduleArray[module].correctness.score,
            moduleArray[module].rampUp.score, moduleArray[module].responsiveness.score, moduleArray[module].licensing.score, moduleArray[module].versionPinning.score, moduleArray[module].adherence.score, moduleArray[module].netScore], function(err) {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`Inserted row with id ${this.lastID}`);
                }
            });

        const sql2 = 'INSERT INTO modules (Name, Version, ID, url) VALUES (?, ?, ?, ?)';
        let repo_name = (moduleArray[module].repo).charAt(0).toUpperCase() + moduleArray[module].repo.slice(1);
        db.run(sql2, [repo_name, moduleArray[module].versionNumber, moduleArray[module].repo, moduleArray[module].url]) // NEED to put in the version number
    }
    db.close()


    // for (var module in moduleArray) {
    //     let full_string: string = moduleArray[module].owner + " " + moduleArray[module].repo + " " + moduleArray[module].ingestible.toString() + '\n';
    //     fs.appendFile(outputFile, full_string, (err) => {
    //         if (err) throw err;
    //     });
    // }
    
    
    // let ingestOut : string;
    // ingestOut = ingestible as string
    // fs.writeSync(FILEOUT, ingestOut);

    // return ingestible


}


async function main() {
    await ingestibility();
    // await calcScores(moduleArray[0]);
    // let ingestible : number = await ingestibility();
    // return ingestible 

}

main();
