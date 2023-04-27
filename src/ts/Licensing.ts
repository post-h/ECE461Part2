import { Metric } from "./Metric";
import { getLicense } from "./GatherData";

export class Licensing implements Metric {
    score: number = 0;

    constructor(public owner: string, public repo: string) {
    }

    calcMetric(): Promise<number> {
        return calc(this.owner, this.repo);
    }
}

async function calc(_owner: string, _repo: string): Promise<number> {
    let licensing_score = await getLicense(_owner, _repo);

    if (licensing_score == null) {
        return 0;
    }
    else {
        return 1;
    }
}