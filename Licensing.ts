import { Metric } from "./Metric";
import { getLicense } from "./GatherData";

export class Licensing {//implements Metric{
    score : number = 0;

    calcMetric() : Promise<number>
    {
        //console.log("Calculating licensing score");
        return calc();
    }
}

// GNU Lesser General Public License version 2.1 is required. GPLv2 and GPLv3 are also compatible. Information is from GNU website --> URL pasted below 
// https://www.gnu.org/licenses/license-list.en.html

async function calc() : Promise<number>
{
    let license : string = await getLicense("nodejs", "node");
    //console.log(license);
    if(license === "GNU Lesser General Public License v2.1" || license === "GNU Lesser General Public v2.0" || license === "GNU Lesser General Public v3.0" || license === "MIT License" || license === "Other")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}
