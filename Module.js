"use strict";
exports.__esModule = true;
exports.Module = void 0;
var RampUp_1 = require("./RampUp");
var Correctness_1 = require("./Correctness");
var BusFactor_1 = require("./BusFactor");
var Responsiveness_1 = require("./Responsiveness");
var Licensing_1 = require("./Licensing");
var Module = /** @class */ (function () {
    // constructor
    function Module(_url) {
        this.url = _url;
        this.netScore = 0;
        // initializes 
        this.rampUp = new RampUp_1.RampUp();
        this.correctness = new Correctness_1.Correctness();
        this.busFactor = new BusFactor_1.BusFactor();
        this.responsiveness = new Responsiveness_1.Responsiveness();
        this.licensing = new Licensing_1.Licensing();
    }
    // methods
    Module.prototype.printURL = function () {
        return this.url;
    };
    Module.prototype.calcRampUpScore = function () {
        this.rampUp.calcMetric();
    };
    Module.prototype.calcCorrectnessScore = function () {
        this.correctness.calcMetric();
    };
    Module.prototype.calcBusFactorScore = function () {
        this.busFactor.calcMetric();
    };
    Module.prototype.calcResponsivenessScore = function () {
        this.responsiveness.calcMetric();
    };
    Module.prototype.calcLicensingScore = function () {
        this.licensing.calcMetric();
    };
    return Module;
}());
exports.Module = Module;
