import { Metric } from "./Metric";
import { getCorrectness } from "./GatherData";
// import { Octokit } from "octokit";

// import { axios } from "axios";

// const GITHUB_BASE = 'https://api.securityscorecards.dev';

// // const octokit = new Octokit({
// //     auth: process.env.GITHUB_TOKEN,  // change to your token for now,  I will figure out how to get to use the environment variable soon
// //     userAgent: 'testing',
// //     timeZone: "Eastern",
// //     baseUrl: 'https://api.github.com',
// // });


export class Correctness{
    score : number = 0; //default

    constructor(public owner: string, public repo: string) {
    }

    calcMetric() : Promise<number>
    {
        return calc(this.owner, this.repo);
        // return 0;
    }
}

async function calc(owner : string, repo : string) : Promise<number>
{
    let correctness_score = await getCorrectness(owner, repo);
    
    return correctness_score;
}
