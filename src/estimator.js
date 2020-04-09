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
  } else if (_data.periodType === 'weeks') {
    days = _data.timeToElapse * 7;
    factor = Math.round(days / 3);
  } else if (_data.periodType === 'months') {
    days = _data.timeToElapse * 4 * 7;
    factor = Math.round(days / 3);
  }
  return factor * _currentlyInfected * 2;
}

// finding total infectionByRequestedTime

function totalInfectionByRequestedTime(_impact, _severe) {
  return _impact + _severe;
}

function hospitalBedsByRequestedTime(_severeCasesinfection, _data) {
  const bedsUsed = 0.65 * _data.totalHospitalBeds;
  const remainingBeds = _data.totalHospitalBeds - bedsUsed;

  return remainingBeds - _severeCasesinfection;
}

// calculating dollars in flight
function dollarsInFlight(_infectionRequestedTime, _data) {
  const total = _infectionRequestedTime * _data.avgDailyIncomeInUSD;
  return total * _data.avgDailyIncomePopulation * _data.timeToElapse;
}


const covid19ImpactEstimator = (data) => {
  const currentlyInfectedTotal = currentlyInfected(data);
  const currentlyInfectedForSeverImpactTotal = currentlyInfectedForSeverImpact(data);
  const ImpactTotal = infectionByRequestedTime(currentlyInfectedTotal, data);
  const severeIRT = infectionByRequestedTime(currentlyInfectedForSeverImpactTotal, data);
  const totalInfectionRequestedTimeTotal = totalInfectionByRequestedTime(ImpactTotal, severeIRT);
  const severeCasesBRTT = 0.15 * totalInfectionRequestedTimeTotal;
  const totalHospitalBedsAvailableTotal = hospitalBedsByRequestedTime(severeCasesBRTT, data);
  const casesForICUByRequestedTimeTotal = 0.05 * totalInfectionRequestedTimeTotal;
  const casesForVentilatorsByRequestedTimeTotal = 0.02 * totalInfectionRequestedTimeTotal;
  const dollarsInFlightTotal = dollarsInFlight(totalInfectionRequestedTimeTotal, data);

  return {
    data,
    impact: {
      currentlyInfected: currentlyInfectedTotal,
      infectionByRequestedTime: ImpactTotal
    },
    severeImpact: {
      currentlyInfected: currentlyInfectedForSeverImpactTotal,
      infectionByRequestedTime: severeIRT
    },
    severeCasesByRequestedTime: severeCasesBRTT,
    hospitalBedsByRequestedTime: totalHospitalBedsAvailableTotal,
    casesForICUByRequestedTime: casesForICUByRequestedTimeTotal,
    casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeTotal,
    dollarsInFlight: dollarsInFlightTotal
  };
};

export default covid19ImpactEstimator;
