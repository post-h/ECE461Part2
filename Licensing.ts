import { Metric } from "./Metric";

export class Licensing implements Metric{
    score : number = 0;

    calcMetric() : number
    {
        console.log("Calculating licensing score");
        return 0;
    }
}