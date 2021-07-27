//var inputs = { //Sample object including all necessary data inputs to run MAGGIC
//  "EF": 25,
//  "Age": 54,
//  "SBP": 140,
//  "BMI": 18.5,
//  "Creatinine": 200, //input with units of micromoles/liter
//  "NYHA": 4,
//  "Gender": "female",
//  "Smoker": false,
//  "Diabetic": false,
//  "COPD": false,
//  "DateDiagnosed": 1.6, //Date diagnosed can either be provided as "year since diagnosis" (for retrospective use) or as the actual date of diagnosis (for prospective use)
//  "BetaBlocker": false,
//  "ACEiARB": true,
//};

function maggicRiskScore(inputs) {
  var outputs = {};

  outputs.riskOutputs = calculateRisk(inputs);

  return outputs; //Output MAGGIC score, 1-, and 3- year mortality probability
}

function calculateRisk(inputs) {
  var riskFactorOutputs = {};

  //Calculate ejection fraction risk score contribution
    if (inputs.EF < 20) {
      riskFactorOutputs.EF = 7;
    } else if (inputs.EF < 25) {
      riskFactorOutputs.EF = 6;
    } else if (inputs.EF < 30) {
      riskFactorOutputs.EF = 5;
    } else if (inputs.EF < 35) {
      riskFactorOutputs.EF = 3;
    } else if (inputs.EF < 40) {
      riskFactorOutputs.EF = 2;
    } else {
      riskFactorOutputs.EF = 0
    }

  //Calculate age risk score contribution
    if (inputs.EF < 30) {
      if (inputs.Age < 55) {
        riskFactorOutputs.Age = 0;
      } else if (inputs.Age < 60) {
        riskFactorOutputs.Age = 2;
      } else if (inputs.Age < 65) {
        riskFactorOutputs.Age = 4;
      } else if (inputs.Age < 70) {
        riskFactorOutputs.Age = 6;
      } else if (inputs.Age < 75) {
        riskFactorOutputs.Age = 8;
      } else if (inputs.Age < 80) {
        riskFactorOutputs.Age = 10;
      } else {
        riskFactorOutputs.Age = 13;
      }
    } else if (inputs.EF < 40) {
        if (inputs.Age < 55) {
          riskFactorOutputs.Age = 0;
        } else if (inputs.Age < 60) {
          riskFactorOutputs.Age = 2;
        } else if (inputs.Age < 65) {
          riskFactorOutputs.Age = 4;
        } else if (inputs.Age < 70) {
          riskFactorOutputs.Age = 6;
        } else if (inputs.Age < 75) {
          riskFactorOutputs.Age = 8;
        } else if (inputs.Age < 80) {
          riskFactorOutputs.Age = 10;
        } else {
          riskFactorOutputs.Age = 13;
        }
    } else {
        if (inputs.Age < 55) {
          riskFactorOutputs.Age = 0;
        } else if (inputs.Age < 60) {
          riskFactorOutputs.Age = 3;
        } else if (inputs.Age < 65) {
          riskFactorOutputs.Age = 5;
        } else if (inputs.Age < 70) {
          riskFactorOutputs.Age = 7;
        } else if (inputs.Age < 75) {
          riskFactorOutputs.Age = 9;
        } else if (inputs.Age < 80) {
          riskFactorOutputs.Age = 12;
        } else {
          riskFactorOutputs.Age = 15;
        }
    }


  //Calculate systolic blood pressure score contribution;
    if (inputs.EF < 30) {
      if (inputs.SBP < 110) {
        riskFactorOutputs.SBP =  5;
      } else if (inputs.SBP < 120) {
        riskFactorOutputs.SBP = 4;
      } else if (inputs.SBP < 130) {
        riskFactorOutputs.SBP = 3;
      } else if (inputs.SBP < 140) {
        riskFactorOutputs.SBP = 2;
      } else if (inputs.SBP < 150) {
        riskFactorOutputs.SBP = 1;
      } else {
        riskFactorOutputs.SBP = 0;
      }
    } else if (inputs.EF < 40) {
      if (inputs.SBP < 110) {
        riskFactorOutputs.SBP = 3;
      } else if (inputs.SBP < 120) {
        riskFactorOutputs.SBP = 2;
      } else if (inputs.SBP < 130) {
        riskFactorOutputs.SBP = 1;
      } else if (inputs.SBP < 140) {
        riskFactorOutputs.SBP = 1;
      } else if (inputs.SBP < 150) {
        riskFactorOutputs.SBP = 0;
      } else {
        riskFactorOutputs.SBP = 0;
      }
    } else {
      if (inputs.SBP < 110) {
        riskFactorOutputs.SBP = 2;
      } else if (inputs.SBP < 120) {
        riskFactorOutputs.SBP = 1;
      } else if (inputs.SBP < 130) {
        riskFactorOutputs.SBP = 1;
      } else if (inputs.SBP < 140) {
        riskFactorOutputs.SBP = 0;
      } else if (inputs.SBP < 150) {
        riskFactorOutputs.SBP = 0;
      } else {
        riskFactorOutputs.SBP = 0;
      }
    }

  //Calculate BMI score contribution
    if (inputs.BMI < 15) {
      riskFactorOutputs.BMI = 6;
    } else if (inputs.BMI < 20) {
      riskFactorOutputs.BMI = 5;
    } else if (inputs.BMI < 25) {
      riskFactorOutputs.BMI = 3;
    } else if (inputs.BMI < 30) {
      riskFactorOutputs.BMI = 2;
    } else {
      riskFactorOutputs.BMI = 0;
    }

  //Calculate Creatinne score contribution
    if (inputs.Creatinine < 90) {
      riskFactorOutputs.Creatinine = 0;
    } else if (inputs.Creatinine < 110) {
      riskFactorOutputs.Creatinine = 1;
    } else if (inputs.Creatinine < 130) {
      riskFactorOutputs.Creatinine = 2;
    } else if (inputs.Creatinine < 150) {
      riskFactorOutputs.Creatinine = 3;
    } else if (inputs.Creatinine < 170) {
      riskFactorOutputs.Creatinine = 4;
    } else if (inputs.Creatinine < 210) {
      riskFactorOutputs.Creatinine = 5;
    } else if (inputs.Creatinine < 250) {
      riskFactorOutputs.Creatinine = 6;
    } else {
      riskFactorOutputs.Creatinine = 8;
    }

  //Calculate NYHA class score contribution
    if (inputs.NYHA == 1) {
      riskFactorOutputs.NYHA = 0;
    } else if (inputs.NYHA == 2) {
      riskFactorOutputs.NYHA = 2;
    } else if (inputs.NYHA == 3) {
      riskFactorOutputs.NYHA = 6;
    } else if (inputs.NYHA == 4) {
      riskFactorOutputs.NYHA = 8;
    }

  //Calculate gender score contribution
    if (inputs.Gender == "male") {
      riskFactorOutputs.Gender = 1;
    } else {
      riskFactorOutputs.Gender = 0;
    }

  //Calculate smoking status score contribution
    if (inputs.Smoker) {
      riskFactorOutputs.Smoker = 1;
    } else {
      riskFactorOutputs.Smoker = 0;
    }

  //Calculate diabetic status score contribution
    if (inputs.Diabetes) {
      riskFactorOutputs.Diabetes = 3;
    } else {
      riskFactorOutputs.Diabetes = 0;
    }

  //Calculate COPD status score contribution
    if (inputs.COPD) {
      riskFactorOutputs.COPD = 2;
    } else {
      riskFactorOutputs.COPD = 0;
    }

  //Calculate diagnosis date score contribution
  //If KO is being used retrospectively, determine the length of time it has been between the date of interest and the original diagnosis, prior to inputing data
  //If KO is being used prospectively, use the date of diagnosis as the initial input
    if (typeof inputs.DateDiagnosed === "number" && inputs.DateDiagnosed <= 1.5) {
      riskFactorOutputs.DateDiagnosed = 2;
    } else if (typeof inputs.DateDiagnosed === "number" && inputs.DateDiagnosed > 1.5) {
      riskFactorOutputs.DateDiagnosed = 0;
    } else {
      var dateDiagnosed = new Date(inputs.DateDiagnosed);
      var dateToday = Date.now();
      var timeSinceDiagnosis = (dateToday - dateDiagnosed)/(1000 * 60 * 60 * 24 * 365);
      if (timeSinceDiagnosis <= 1.5) {
        riskFactorOutputs.DateDiagnosed = 2;
      } else {
        riskFactorOutputs.DateDiagnosed = 0;
      }
    }

  //Calculate beta blocker score contribution
    if (inputs.BetaBlocker) {
      riskFactorOutputs.BetaBlocker = 0;
    } else {
      riskFactorOutputs.BetaBlocker = 3;
    }

  //Calculate ACEi/ARB score contribution
    if (inputs.ACEiARB) {
      riskFactorOutputs.ACEiARB = 0;
    } else {
      riskFactorOutputs.ACEiARB = 1;
    }

  //Calculate the total MAGGIC integer score
    var integerRiskScore = 0
    for (let val in riskFactorOutputs) {
      integerRiskScore += riskFactorOutputs[val];
    }

    var mortalityProbabilityArray = [ //Mortality probability for each MAGGIC score 0-50 [1-year, 3-year]
      [0.015, 0.039], [0.016, 0.043], [0.018, 0.048], [0.020, 0.052], [0.022, 0.058],
      [0.024, 0.063], [0.027, 0.070], [0.029, 0.077], [0.032, 0.084], [0.036, 0.092],
      [0.039, 0.102], [0.043, 0.111], [0.048, 0.122], [0.052, 0.134], [0.058, 0.146],
      [0.063, 0.160], [0.070, 0.175], [0.077, 0.191], [0.084, 0.209], [0.093, 0.227],
      [0.102, 0.247], [0.111, 0.269], [0.122, 0.292], [0.134, 0.316], [0.147, 0.342],
      [0.160, 0.369], [0.175, 0.397], [0.191, 0.427], [0.209, 0.458], [0.227, 0.490],
      [0.248, 0.523], [0.269, 0.556], [0.292, 0.590], [0.316, 0.625], [0.342, 0.658],
      [0.369, 0.692], [0.398, 0.725], [0.427, 0.756], [0.458, 0.787], [0.490, 0.815],
      [0.523, 0.842], [0.557, 0.866], [0.591, 0.889], [0.625, 0.908], [0.659, 0.926],
      [0.692, 0.941], [0.725, 0.953], [0.757, 0.964], [0.787, 0.973], [0.816, 0.980],
      [0.842, 0.985]];

    var results = {}
    results["Integer Risk Score"] = integerRiskScore;
    results["One Year Mortality Probability"] = mortalityProbabilityArray[integerRiskScore][0];
    results["Three Year Mortality Probability"] = mortalityProbabilityArray[integerRiskScore][1];

    return results;
  }

//console.log(maggicRiskScore(inputs));
