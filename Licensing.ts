import { Metric } from "./Metric";
import { getLicense } from "./GatherData";

export class Licensing {//implements Metric{
    score : number = 0;

    calcMetric() : Promise<number>
    {
        console.log("Calculating licensing score");
         
        let value : Promise<number> = calc();
        return value;
    }
}

// GNU Lesser General Public License version 2.1 is required. GPLv2 and GPLv3 are also compatible. Information is from GNU website --> URL pasted below 
// https://www.gnu.org/licenses/license-list.en.html

async function calc() : Promise<number>
{
    let license : string = await getLicense("jonrandoem", "eyeos");
    console.log(license);
    if(license === "GNU Lesser General Public License v2.1")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}
