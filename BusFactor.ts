import { Metric } from "./Metric";

export class BusFactor implements Metric{
    score : number = 0;

    calcMetric() : number
    {
        console.log("Calculating bus factor score");
        return 0;
    }
}