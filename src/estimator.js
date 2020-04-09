// function for currently infected people
function currentlyInfected(_data) {
  return _data.reportedCases * 10;
}

function currentlyInfectedForSeverImpact(_data) {
  return _data.reportedCases * 50;
}

function infectionByRequestedTime(_currentlyInfected, _data) {
  let factor = 1;
  let days = 1;
  // const days
  // converting all period types to days
  // and finding the factor
  if (_data.periodType === 'days') {
    factor = Math.round(_data.timeToElapse / 3); 
  }
  else if (_data.periodType === 'weeks') {
    days = _data.timeToElapse * 7 
    factor = Math.round(days / 3);
  }
  else if (_data.periodType === 'months') {
    days = _data.timeToElapse * 4 * 7
    factor = Math.round(days / 3);
  }
  return factor * _currentlyInfected * 2;
}

// finding total infectionByRequestedTime

function totalInfectionByRequestedTime(_impact, _severe) {
  return _impact + _severe;
}

function hospitalBedsByRequestedTime(_severeCasesinfection, _data) {
  let bedsUsed = 0.65 * _data.totalHospitalBeds;
  let remainingBeds = _data.totalHospitalBeds - bedsUsed;

  return remainingBeds - _severeCasesinfection;
}

// calculating dollars in flight 
function dollarsInFlight(_infectionRequestedTime, _data) {
  return _infectionRequestedTime * _data.avgDailyIncomeInUSD * _data.avgDailyIncomePopulation * _data.timeToElapse;
}


const covid19ImpactEstimator = (data) => {
  let _currentlyInfected = currentlyInfected(data);
  let _currentlyInfectedForSeverImpact = currentlyInfectedForSeverImpact(data);
  let _Impact = infectionByRequestedTime(currentlyInfected, data);
  let _severeInfectionRequestedTime = infectionByRequestedTime(_currentlyInfectedForSeverImpact, data)
  let _totalInfectionRequestedTime = totalInfectionByRequestedTime(_Impact, _severeInfectionRequestedTime);
  let _severeCasesByRequestedTime = 0.15 * _totalInfectionRequestedTime;
  let _totalHospitalBedsAvailable = hospitalBedsByRequestedTime(_severeCasesByRequestedTime, data)
  let _casesForICUByRequestedTime = 0.05 * _totalInfectionRequestedTime;
  let _casesForVentilatorsByRequestedTime = 0.02 * _totalInfectionRequestedTime;
  let _dollarsInFlight = dollarsInFlight(_totalInfectionRequestedTime, data);

  return {
    data: data,
    impact: {
      currentlyInfected: _currentlyInfected,
      infectionByRequestedTime: _Impact
    },
    severeImpact: {
      currentlyInfected: _currentlyInfectedForSeverImpact,
      infectionByRequestedTime: _severeInfectionRequestedTime
    },
    severeCasesByRequestedTime: _severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: _totalHospitalBedsAvailable,
    casesForICUByRequestedTime: _casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: _casesForVentilatorsByRequestedTime,
    dollarsInFlight: _dollarsInFlight 
  }
};

export default covid19ImpactEstimator;

