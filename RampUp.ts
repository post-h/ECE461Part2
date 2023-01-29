import { Metric } from "./Metric";

export class RampUp implements Metric{
    score : number = 0;

    calcMetric() : number
    {
        console.log("Calculating ramp up score");
        return 0;
    }
}