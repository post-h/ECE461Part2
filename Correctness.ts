import { Metric } from "./Metric";

export class Correctness implements Metric{
    score : number = 0;

    calcMetric() : number
    {
        console.log("Calculating correctness score");
        return 0;
    }
}