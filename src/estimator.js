// function for currently infected people
function currentlyInfected(_data) {
    return _data.reportedCases * 10;
}

function currentlyInfectedForSeverImpact(_data) {
    return _data.reportedCases * 50;
}

function infectionByRequestedTime(_currentlyInfected, _data) {
    factor = 1;
    // converting all period types to days
    // and finding the factor
    if (_data.periodType === "days") {
        factor = Math.round(data.timeToElapse / 3);
    } else if (_data.periodType === "weeks") {
        days = Math.round(data.timeToElapse * 7);
        factor = Math.round(days / 3);
    } else if (_data.periodType === "months") {
        days = Math.round(data.timeToElapse * 4 * 7);
        factor = Math.round(days / 3);
    }
    return factor * _currentlyInfected * 2;
}

// finding total infectionByRequestedTime

function totalInfectionByRequestedTime(_impact, _severe) {
    return _impact + _severe;
}

function hospitalBedsByRequestedTime(_severeCasesinfection, _data) {
    beds_used = 0.65 * _data.totalHospitalBeds;
    remaining_beds = _data.totalHospitalBeds - beds_used;

    return remaining_beds - _severeCasesinfection;
}

// calculating dollars in flight 
function dollarsInFlight(_infectionRequestedTime, _data) {
    return _infectionRequestedTime * _data.avgDailyIncomeInUSD * _data.avgDailyIncomePopulation * _data.timeToElapse;
}


const covid19ImpactEstimator = (data) => {
    _currentlyInfected = currentlyInfected(data);
    _currentlyInfectedForSeverImpact = currentlyInfectedForSeverImpact(data);
    _Impact = infectionByRequestedTime(currentlyInfected, data);
    _severeInfectionRequestedTime = infectionByRequestedTime(_currentlyInfectedForSeverImpact, data)
    _totalInfectionRequestedTime = totalInfectionByRequestedTime(_Impact, _severeInfectionRequestedTime);
    _severeCasesByRequestedTime = 0.15 * _totalInfectionRequestedTime;
    _totalHospitalBedsAvailable = totalHospitalBeds(_severeCasesByRequestedTime, data)
    _casesForICUByRequestedTime = 0.05 * _totalInfectionRequestedTime;
    _casesForVentilatorsByRequestedTime = 0.02 * _totalInfectionRequestedTime;
    _dollarsInFlight = dollarsInFlight(_totalInfectionRequestedTime, data);

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

