import { Metric } from "./Metric";

export class Responsiveness implements Metric{
    score : number = 0;

    calcMetric() : number
    {
        console.log("Calculating responsiveness score");
        return 0;
    }
}