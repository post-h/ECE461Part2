
import { Metric } from "./Metric";
import { RampUp } from "./RampUp";
import { Correctness } from "./Correctness";
import { BusFactor } from "./BusFactor";
import { Responsiveness } from "./Responsiveness";
import { Licensing } from "./Licensing"
import { Adherence } from "./Adherence";
import { VersionPinning } from "./VersionPinning";

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
    adherence : Adherence;
    versionPinning : VersionPinning;
    
    rampUpScore: number;
    // correctnessScore: number;
    // busFactorScore: number;
    // responsivenessScore: number;
    // licensingScore: number;
    // adherenceScore: number;
    // versionPinningScore: number;
    ingestible: number;


    // constructor
    constructor(_url : string)
    {
        this.url = _url;
        this.owner = this.url.split('/')[3];                   // gets owner where owner is equal to expressjs in test
        this.repo = this.url.split('/')[4];      // gets repo where repo is equal to express in test
        this.netScore = 0;

        // initializes each type of metric
        this.rampUp = new RampUp(_url);
        this.correctness = new Correctness(this.owner, this.repo); 
        this.busFactor = new BusFactor(this.owner, this.repo);
        this.responsiveness = new Responsiveness(this.owner, this.repo);
        this.licensing = new Licensing(this.owner, this.repo);
        this.adherence = new Adherence(this.owner, this.repo);
        this.versionPinning = new VersionPinning(this.owner, this.repo);
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

    async calcCorrectnessScore()
    {
        // this.correctnessScore = -1;
        this.correctness.score = await this.correctness.calcMetric();
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

    async calcAdherenceScore()
    {
        this.adherence.score = await this.adherence.calcMetric();
    }

    async calcVersionPinningScore()
    {
        this.versionPinning.score = await this.versionPinning.calcMetric();
    }
    
    async calcNetScore() // might have to make this call and await each metric, and then calculate the weighted sum
    {
        // add metrics here
        // await this.calcLicensingScore();
        // await this.calcBusFactorScore(); commented out but if err check here!!!!!!!!!!!!!!!!!!
        // this.netScore = Math.min(this.licensing.score, ((0.2 * this.rampUpScore) + (0.5 * this.responsiveness.score) + (0.3 * this.busFactor.score))); // add weighting scale to this
        this.netScore = (this.adherence.score + this.licensing.score + this.versionPinning.score + this.responsiveness.score + this.rampUpScore + this.busFactor.score + this.correctness.score) / 7;
        //console.log(this.netScore);
    }

}
