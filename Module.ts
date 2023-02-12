
import { Metric } from "./Metric";
import { RampUp } from "./RampUp";
import { Correctness } from "./Correctness";
import { BusFactor } from "./BusFactor";
import { Responsiveness } from "./Responsiveness";
import { Licensing } from "./Licensing"

export class Module {
    // private instance variables
    url : string;
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
        this.netScore = 0;

        // initializes 
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

    calcLicensingScore()
    {
        this.licensing.calcMetric();
    }
    
}
