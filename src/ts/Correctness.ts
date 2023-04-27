import { Metric } from "./Metric";
import { getCorrectness } from "./GatherData";

export class Correctness implements Metric {
    score: number = 0; //default

    constructor(public owner: string, public repo: string) {
    }

    calcMetric(): Promise<number> {
        return calc(this.owner, this.repo);
    }
}

async function calc(owner: string, repo: string): Promise<number> {
    let correctness_score = await getCorrectness(owner, repo);

    return correctness_score;
}
