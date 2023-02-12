
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
    
    rampUpScore: number;
    correctnessScore: number;
    busFactorScore: number;
    responsivenessScore: number;
    licensingScore: number;

    // constructor
    constructor(_url : string)
    {
        this.url = _url;
        this.owner = this.url.split('/')[3];                   // gets owner where owner is equal to expressjs in test
        this.repo = this.url.split('/')[4];      // gets repo where repo is equal to express in test
        this.netScore = 0;

        // initializes each type of metric
        this.rampUp = new RampUp(_url);
        this.correctness = new Correctness(); 
        this.busFactor = new BusFactor(this.owner, this.repo);
        this.responsiveness = new Responsiveness(this.owner, this.repo);
        this.licensing = new Licensing(this.owner, this.repo);
    }

    // methods
    printURL()
    {
        return this.url;
    }

    calcRampUpScore()
    {
        this.rampUpScore = this.rampUp.calcMetric(); 
        return this.rampUpScore;
    }

    calcCorrectnessScore()
    {
        this.correctnessScore = -1;
        // this.correctness.calcMetric();
        return this.correctnessScore;
    }

    async calcBusFactorScore()
    {
        this.busFactor.score = await this.busFactor.calcMetric();
    }

    async calcResponsivenessScore()
    {
        this.responsiveness.score = await this.responsiveness.calcMetric();
        
    }

    async calcLicensingScore()
    {
        this.licensing.score = await this.licensing.calcMetric();
    }
    
    async calcNetScore() // might have to make this call and await each metric, and then calculate the weighted sum
    {
        // add metrics here
        await this.calcLicensingScore();
        await this.calcBusFactorScore();
        this.netScore = Math.min(this.licensing.score, ((0.2 * this.rampUpScore) + (0.5 * this.responsiveness.score) + (0.3 * this.busFactor.score))); // add weighting scale to this
        //console.log(this.netScore);
    }

}
