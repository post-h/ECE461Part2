import { Metric } from "./Metric";
import { getVersionPinning } from "./GatherData";

export class VersionPinning implements Metric {
    score: number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric(): Promise<number> {
        return calc(this.owner, this.repo);
    }
}

async function calc(owner: string, repo: string): Promise<number> {
    let versionPinnning: boolean = await getVersionPinning(owner, repo);
    let score: number = 0; //defaults false
    if (versionPinnning) {
        score = 1;
    }

    return score;
}
