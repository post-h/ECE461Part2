import { Module } from "./Module";

/* RAMP UP TESTS */
function _test_rampUp_easy(tests_passed:number) {
    let module = new Module("https://github.com/hasier1227/461_test");

    let output = module.calcRampUpScore();
    output = +(output.toFixed(1));

    if (output == 0.3) {
        tests_passed++;
    }

    return tests_passed;
}

function _test_rampUp_medium(tests_passed:number) {
    let module = new Module("https://github.com/cloudinary/cloudinary_npm");

    let output = module.calcRampUpScore();
    output = +(output.toFixed(1));

    if (output == 0.3) {
        tests_passed++;
    }

    return tests_passed;
}

function _test_rampUp_hard(tests_passed:number) {
    let module = new Module("https://github.com/lodash/lodash");

    let output = module.calcRampUpScore();
    output = +(output.toFixed(1));

    if (output == 0.7) {
        tests_passed++;
    }

    return tests_passed;
}

function _test_rampUp_edge(tests_passed:number) {
    let module = new Module("https://github.com/aaronlovell7/ECE461TeamAFJK");

    let output = module.calcRampUpScore();
    output = +(output.toFixed(1));

    if (output == 0.5) {
        tests_passed++;
    }

    return tests_passed;
}

function _test_rampUp_edge2(tests_passed:number) {
    let module = new Module("https://github.com/jonrandoem/eyeos");

    let output = module.calcRampUpScore();
    output = +(output.toFixed(1));

    if (output == 0.7) {
        tests_passed++;
    }

    return tests_passed;
}

/* BUS FACTOR TEST */
async function _test_BusFactor_easy(tests_passed:number) {
    let module = new Module("https://github.com/hasier1227/461_test");

    await module.calcBusFactorScore();
    let output = module.busFactor.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_BusFactor_medium(tests_passed:number) {
    let module = new Module("https://github.com/cloudinary/cloudinary_npm");

    await module.calcBusFactorScore();
    let output = module.busFactor.score;
    output = +(output.toFixed(1));

    if (output == 0.4) {
        tests_passed++;
    }
    
    return tests_passed;
}

async function _test_BusFactor_hard(tests_passed:number) {
    let module = new Module("https://github.com/lodash/lodash");

    await module.calcBusFactorScore();
    let output = module.busFactor.score;
    output = +(output.toFixed(1));

    if (output == 0.5) {
        tests_passed++;
    }
    
    return tests_passed;
}

async function _test_BusFactor_edge(tests_passed:number) {
    let module = new Module("https://github.com/aaronlovell7/ECE461TeamAFJK");

    await module.calcBusFactorScore();
    let output = module.busFactor.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }
    
    return tests_passed;
}

async function _test_BusFactor_edge2(tests_passed:number) {
    let module = new Module("https://github.com/jonrandoem/eyeos");

    await module.calcBusFactorScore();
    let output = module.busFactor.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }
    
    return tests_passed;
}

/* RESPONSIVENESS TESTS */
async function _test_Responsiveness_easy(tests_passed:number) {
    let module = new Module("https://github.com/hasier1227/461_test");

    await module.calcResponsivenessScore();
    let output = module.responsiveness.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Responsiveness_medium(tests_passed:number) {
    let module = new Module("https://github.com/cloudinary/cloudinary_npm");

    await module.calcResponsivenessScore();
    let output = module.responsiveness.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Responsiveness_hard(tests_passed:number) {
    let module = new Module("https://github.com/lodash/lodash");

    await module.calcResponsivenessScore();
    let output = module.responsiveness.score;
    output = +(output.toFixed(1));

    if (output == 0.4) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Responsiveness_edge(tests_passed:number) {
    let module = new Module("https://github.com/aaronlovell7/ECE461TeamAFJK");

    await module.calcResponsivenessScore();
    let output = module.responsiveness.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Responsiveness_edge2(tests_passed:number) {
    let module = new Module("https://github.com/jonrandoem/eyeos");

    await module.calcResponsivenessScore();
    let output = module.responsiveness.score;
    output = +(output.toFixed(1));

    if (output == 0.0) {
        tests_passed++;
    }

    return tests_passed;
}

/* LICENSING TESTS */
async function _test_Licensing_easy(tests_passed:number) {
    let module = new Module("https://github.com/hasier1227/461_test");

    await module.calcLicensingScore();

    if(module.licensing.score == 0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Licensing_medium(tests_passed:number) {
    let module = new Module("https://github.com/browserify/browserify");

    await module.calcLicensingScore();

    if(module.licensing.score == 1) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Licensing_hard(tests_passed:number) {
    let module = new Module("https://github.com/expressjs/express");

    await module.calcLicensingScore();

    if(module.licensing.score == 1) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Licensing_edge(tests_passed:number) {
    let module = new Module("https://github.com/lodash/lodash");

    await module.calcLicensingScore();

    if(module.licensing.score == 0) {
        tests_passed++;
    }

    return tests_passed;
}

async function _test_Licensing_edge2(tests_passed:number) {
    let module = new Module("https://github.com/jonrandoem/eyeos");

    await module.calcLicensingScore();

    if(module.licensing.score == 0) {
        tests_passed++;
    }

    return tests_passed;
}

/* MAIN TESTS */
function _test_Main_easy(tests_passed:number) {
    
    return tests_passed;
}

function _test_Main_medium(tests_passed:number) {
    

    return tests_passed;
}

function _test_Main_hard(tests_passed:number) {
    
    return tests_passed;
}

function _test_Main_edge(tests_passed:number) {
    
    return tests_passed;
}

/* TEST CALLER */
async function main(tests_passed:number) {
    tests_passed = _test_rampUp_easy(tests_passed);
    tests_passed = _test_rampUp_medium(tests_passed);
    tests_passed = _test_rampUp_hard(tests_passed);
    tests_passed = _test_rampUp_edge(tests_passed);
    tests_passed = _test_rampUp_edge2(tests_passed);

    tests_passed = await _test_BusFactor_easy(tests_passed);
    tests_passed = await _test_BusFactor_medium(tests_passed);
    tests_passed = await _test_BusFactor_hard(tests_passed);
    tests_passed = await _test_BusFactor_edge(tests_passed);
    tests_passed = await _test_BusFactor_edge2(tests_passed);

    tests_passed = await _test_Responsiveness_easy(tests_passed);
    tests_passed = await _test_Responsiveness_medium(tests_passed);
    tests_passed = await _test_Responsiveness_hard(tests_passed);
    tests_passed = await _test_Responsiveness_edge(tests_passed);
    tests_passed = await _test_Responsiveness_edge2(tests_passed);

    tests_passed = await _test_Licensing_easy(tests_passed);
    tests_passed = await _test_Licensing_medium(tests_passed);
    tests_passed = await _test_Licensing_hard(tests_passed);
    tests_passed = await _test_Licensing_edge(tests_passed);
    tests_passed = await _test_Licensing_edge2(tests_passed);

    // tests_passed = _test_Main_easy(tests_passed);
    // tests_passed = _test_Main_medium(tests_passed);
    // tests_passed = _test_Main_hard(tests_passed);
    // tests_passed = _test_Main_edge(tests_passed);

    console.log('Total: 20');
    console.log('Passed: %d', tests_passed);
    console.log('Coverage: %d%', -1);
    console.log('%d/20 test cases passed. %d% line coverage achieved.', tests_passed, -1);

    return 1;
}

main(0);