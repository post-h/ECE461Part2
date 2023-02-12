import { Metric } from "./Metric";
import { getContributors } from "./GatherData";

export class BusFactor {//implements Metric{
    score : number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric() : Promise<number>
    {
        //console.log("Calculating bus factor score");
        return calc(this.owner, this.repo);
    }
}

async function calc(owner : string, repo : string) : Promise<number>
{
    let busFactorScore = await getContributors(owner, repo);
    return busFactorScore;
}
