/************************************************************************************************************************************************************************
 * Name:     Responsiveness
 * Authors:  Kevin Hasier & Fred Kepler
 * Language: TypeScript
 * 
 * Description: 
 *      This file calls calcMaintainers from GatherData.ts to get score on maintainers and returns score to main. 
 ************************************************************************************************************************************************************************/
import { Metric } from "./Metric";
import { calcMaintainers } from "./GatherData";


export class Responsiveness { // implements Metric{
    constructor(public owner:string, public repo:string) {
    }

    calcMetric() : Promise<number>
    {
        let score:Promise<number> = calcMaintainers(this.owner, this.repo);

        return score;
    }
}