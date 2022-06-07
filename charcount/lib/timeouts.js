const UnitsOfTime = {
  millisecond: 1,
  second: 1000,
  minute: 60*1000,
  hour: 60*60*1000,

  milliseconds: 1,
  seconds: 1000,
  minutes: 60*1000,
  hours: 60*60*1000,
}

const recoveryPasswordCount = 15;
const recoveryPasswordUnit = 'minutes';

exports.recoveryPasswordTimeout = {
  maths: recoveryPasswordCount * UnitsOfTime[recoveryPasswordUnit],
  english: recoveryPasswordCount+' '+recoveryPasswordUnit,
}
