import moment from "moment";

export default function momentWeek(date) {
  let result = {
    prevWeekBeginning: moment(date),
    prevWeekEnd: moment(date),
    nextWeekBeginning: moment(date),
    nextWeekEnd: moment(date),
    weeksInMonth: 0,
    daysInFirstWeek: 0,
    daysInLastWeek: 0,
  };

  // Prev week
  while (result.prevWeekBeginning.format("dddd") !== "Monday") {
    result.prevWeekBeginning.subtract(1, "days");
    result.prevWeekEnd.subtract(1, "days");
  }

  result.prevWeekBeginning.subtract(1, "weeks");
  result.prevWeekBeginning.startOf("day");
  result.prevWeekEnd.subtract(1, "day");
  result.prevWeekEnd.endOf("day");

  // Next week
  while (result.nextWeekBeginning.format("dddd") !== "Monday") {
    result.nextWeekBeginning.add(1, "days");
    result.nextWeekEnd.add(1, "days");
  }

  result.nextWeekBeginning.startOf("day");
  result.nextWeekEnd.add(1, "weeks");
  result.nextWeekEnd.subtract(1, "day");
  result.nextWeekEnd.endOf("day");

  //Weeks in month
  let tempDate = moment(date);
  let tempDayCount = 0;
  let weekCount = 0;
  let notFullWeeks = 0;

  const daysOfWeek = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  var getDayNum = (dayName) => {
    return daysOfWeek[dayName];
  };

  const daysInMonth = tempDate.daysInMonth();
  tempDayCount = daysInMonth;

  const firstDayOfMonth = moment(new Date(date.toDate().setDate(1)));
  const lastDayOfMonth = moment(new Date(date.toDate().setDate(daysInMonth)));

  const firstDayOfMonthDayNum = getDayNum(firstDayOfMonth.format("dddd"));
  const lastDayOfMonthDayNum = getDayNum(lastDayOfMonth.format("dddd"));

result.daysInFirstWeek = 8 - firstDayOfMonthDayNum;
  if (firstDayOfMonthDayNum !== 1) {
    tempDayCount -= 8 - firstDayOfMonthDayNum;
    notFullWeeks++;
  }

result.daysInLastWeek = lastDayOfMonthDayNum;
  if (lastDayOfMonthDayNum !== 7) {
    tempDayCount -= lastDayOfMonthDayNum;
    notFullWeeks++;
  }

  weekCount = tempDayCount / 7 + notFullWeeks;
  result.weeksInMonth = weekCount;

  return result;
}
