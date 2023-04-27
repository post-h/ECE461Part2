/************************************************************************************************************************************************************************
 * Name:     Responsiveness
 * Authors:  Kevin Hasier & Fred Kepler
 * Language: TypeScript
 * 
 * Description: 
 *      This file calls calcMaintainers from GatherData.ts to get score on maintainers and returns score to main. 
 ************************************************************************************************************************************************************************/
import { Metric } from "./Metric";
import { calcMaintainers } from "./GatherData";


export class Responsiveness { // implements Metric{
    score : number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric() : Promise<number>
    {
        return calc(this.owner, this.repo);
    }
}

async function calc(owner : string, repo : string) : Promise<number>
{
    let responsivenessScore = await calcMaintainers(owner, repo);
    return responsivenessScore;
}