import { Metric } from "./Metric";
import { getContributors } from "./GatherData";

export class BusFactor {//implements Metric{
    score : number = 0;

    calcMetric() : Promise<number>
    {
        //console.log("Calculating bus factor score");
        return calc();
    }
}

async function calc() : Promise<number>
{
    let busFactorScore = await getContributors("nodejs", "node");

    return busFactorScore;
}
