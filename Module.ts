
import { Metric } from "./Metric";
import { RampUp } from "./RampUp";
import { Correctness } from "./Correctness";
import { BusFactor } from "./BusFactor";
import { Responsiveness } from "./Responsiveness";
import { Licensing } from "./Licensing"

export class Module {
    // private instance variables
    url : string;
    owner: string;
    repo: string;
    netScore : number;
    
    rampUp : RampUp;
    correctness : Correctness;
    busFactor : BusFactor;
    responsiveness : Responsiveness;
    licensing : Licensing;
    

    // constructor
    constructor(_url : string)
    {
        this.url = _url;
        //this.owner = regex expression to extract owner from url
        //this.repo = regex expression to extract repo from url
        this.netScore = 0;

        // initializes each type of metric
        this.rampUp = new RampUp(_url);
        this.correctness = new Correctness(); 
        this.busFactor = new BusFactor();
        this.responsiveness = new Responsiveness();
        this.licensing = new Licensing();
    }

    // methods
    printURL()
    {
        return this.url;
    }

    calcRampUpScore()
    {
        this.rampUp.calcMetric();
    }

    calcCorrectnessScore()
    {
        this.correctness.calcMetric();
    }

    calcBusFactorScore()
    {
        this.busFactor.calcMetric();
    }

    calcResponsivenessScore()
    {
        this.responsiveness.calcMetric();
    }

    async calcLicensingScore()
    {
        this.licensing.score = await this.licensing.calcMetric();
        //console.log(this.licensing.score)
    }
    
    async calcNetScore()
    {
        this.netScore = this.licensing.score + 0.5;
    }

}
