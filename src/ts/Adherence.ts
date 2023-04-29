import { Metric } from "./Metric";
import { getAdherence } from "./GatherData";

export class Adherence implements Metric {
    score: number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric(): Promise<number> {
        return calc(this.owner, this.repo);
    }
}

async function calc(owner: string, repo: string): Promise<number> {
    let adherence: number = await getAdherence(owner, repo);

    return adherence;
}
